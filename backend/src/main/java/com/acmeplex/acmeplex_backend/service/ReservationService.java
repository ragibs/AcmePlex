package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.*;
import com.acmeplex.acmeplex_backend.repository.ReservationRepository;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.thymeleaf.context.Context;

/**
 * Service class for managing reservations, including creating, fetching, and canceling reservations,
 * as well as triggering related tasks like ticket creation.
 */
@Service
public class ReservationService{

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private TicketService ticketService;
    @Autowired
    private UserService userService;
    @Autowired
    private RegisteredUserService registeredUserService;
    @Autowired
    private CouponService couponService;
    @Autowired
    private SeatService seatService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ShowtimeService showtimeService;

    public Optional<Reservation> getReservationById(long Id){
        return reservationRepository.findById(Id);
    }

    public List<Reservation> getAllReservations(){
        return reservationRepository.findAll();
    }

    /**
     * Creates a new reservation based on the provided reservation request.
     * This method also creates the associated tickets, updates seat availability,
     * and sends a confirmation email to the user.
     *
     * @param reservationRequest the details for the new reservation
     * @return the ID of the newly created reservation
     * @throws IllegalArgumentException if any of the seats are already booked
     */
    public Long createReservation(ReservationRequest reservationRequest){
        if (!userService.userExists(reservationRequest.userEmail())){
            userService.registerUser(reservationRequest.userEmail());
        }

        if (!seatService.checkSeatAvailability(reservationRequest.seatIDList())){
            throw new IllegalArgumentException("These seats have already been booked");
        }
        Reservation reservation = new Reservation();
        reservation.setStatus("VALID");
        reservation.setUser(userService.getUser(reservationRequest.userEmail()));
        reservation.setPaymentConfirmation(reservationRequest.paymentConfirmation());
        reservation.setReservationValue(reservationRequest.reservationValue());
        reservation.setReservationDate(LocalDateTime.now());
        reservationRepository.save(reservation);
        for (Long seatID: reservationRequest.seatIDList()){
            ticketService.createTicket(reservationRequest.showtimeID(), seatID, reservation.getId());
        }

        Showtime showtime = showtimeService.getShowtimeById(reservationRequest.showtimeID());
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");

        Context context = new Context();
        context.setVariable("email", reservationRequest.userEmail());
        context.setVariable("movieTitle", showtime.getMovie().getName());
        context.setVariable("date", showtime.getStartTime().format(dateFormatter));
        context.setVariable("showtime", showtime.getStartTime().format(timeFormatter));
        context.setVariable("theatreName", showtime.getTheatre().getName());

        try {
            emailService.sendEmail(
                    reservationRequest.userEmail(),
                    "Your Ticket Confirmation",
                    "ticket-confirmation-template",
                    context
            );
        } catch ( MessagingException error) {
            System.err.println("Failed to send email: " + error.getMessage());
        }


        return reservation.getId();
    }

    /**
     * Retrieves reservation details for the user based on email and reservation ID.
     *
     * @param email the user's email address
     * @param reservationID the ID of the reservation
     * @return a {@link ReservationConfirmation} object containing the reservation details
     * @throws IllegalArgumentException if the reservation does not exist or the email does not match
     */
    public ReservationConfirmation getReservationDetails(String email, Long reservationID){
        Optional<Reservation> reservationOptional = reservationRepository.findById(reservationID);
        if (reservationOptional.isEmpty()) {
            throw new IllegalArgumentException("Please ensure that reservation was successfully saved");
        }
        Reservation reservation = reservationOptional.get();

        if (!reservation.getUser().getEmail().equals(email)){
            throw new IllegalArgumentException("This reservation ID does not belong to the given email address");
        }

        List<Ticket> tickets = reservation.getTickets().stream().toList();
        Ticket ticket = tickets.get(0);
        ReservationConfirmation reservationConfirmation = new ReservationConfirmation();
        reservationConfirmation.setMovieName(ticket.getShowtime().getMovie().getName());
        reservationConfirmation.setMoviePoster(ticket.getShowtime().getMovie().getPoster());
        reservationConfirmation.setShowTime(ticket.getShowtime().getStartTime());
        reservationConfirmation.setUserEmail(reservation.getUser().getEmail());
        reservationConfirmation.setTheatreName(ticket.getShowtime().getTheatre().getName());
        reservationConfirmation.setReservationID(reservation.getId());
        reservationConfirmation.setReservationValue(reservation.getReservationValue());
        reservationConfirmation.setReservationStatus(reservation.getStatus());

        double eligibleRefundValue = reservation.getReservationValue();
        if (!reservationCanBeCancelled(reservationID)) {
            eligibleRefundValue = 0;
        } else if (!(reservation.getUser() instanceof RegisteredUser)) {
            eligibleRefundValue *= 0.85;
        }

        reservationConfirmation.setEligibleRefundValue(eligibleRefundValue);

        for (Ticket ticketItem: tickets){
            reservationConfirmation.addSeatName(ticketItem.getSeat().getSeatNumber());
        }
        return reservationConfirmation;
    }

    /**
     * Cancels a reservation by its ID and creates a coupon on successful cancellation.
     * Refund value is determined based on the category of user where registered users receive full refund.
     *
     * @param reservationID the ID of the reservation to cancel
     * @return a coupon code for the user based on the reservation value
     * @throws IllegalArgumentException if the reservation cannot be cancelled
     */
    public String cancelReservation(Long reservationID){
        Reservation reservation = reservationRepository.findById(reservationID)
                .orElseThrow(()-> new IllegalArgumentException("Invalid Registration ID"));
        ticketService.cancelTickets(reservation.getTickets());

        double couponValue = reservation.getReservationValue();

        if (!(reservation.getUser() instanceof RegisteredUser)){
            couponValue *= 0.85;
        }
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
        return couponService.createCoupon(reservation.getUser(), couponValue);
    }

    /**
     * Checks if a reservation can be cancelled based on current reservation status and duration to movie start.
     *
     * @param reservationID the ID of the reservation to check
     * @return true if the reservation can be cancelled, false otherwise
     * @throws IllegalArgumentException if the reservation does not exist
     */
    public boolean reservationCanBeCancelled(Long reservationID){
        Reservation reservation = reservationRepository.findById(reservationID)
                .orElseThrow(()-> new IllegalArgumentException("Invalid Registration ID"));
        if (reservation.getStatus().equals("CANCELLED")){
            return false;
        }
        boolean cancellable = true;
        for (Ticket ticket: reservation.getTickets()){
            double hoursToMovie = Duration.between(LocalDateTime.now(), ticket.getShowtime().getStartTime()).toHours();
            if (hoursToMovie <= 72){
                cancellable = false;
            }
        }
        return cancellable;
    }
}
