package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.*;
import com.acmeplex.acmeplex_backend.repository.ReservationRepository;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    public Optional<Reservation> getReservationById(long Id){
        return reservationRepository.findById(Id);
    }

    public List<Reservation> getAllReservations(){
        return reservationRepository.findAll();
    }

    public ReservationConfirmation createReservation(ReservationRequest reservationRequest){
        if (!userService.userExists(reservationRequest.userEmail())){
            userService.registerUser(reservationRequest.userEmail());
        }
        Reservation reservation = new Reservation();
        reservation.setStatus("ACTIVE");
        reservation.setUser(userService.getUser(reservationRequest.userEmail()));
        reservation.setPaymentConfirmation(reservationRequest.paymentConfirmation());
        reservation.setReservationValue(reservationRequest.reservationValue());
        reservation.setReservationDate(LocalDateTime.now());
        reservationRepository.save(reservation);
        for (Long seatID: reservationRequest.seatIDList()){
            ticketService.createTicket(reservationRequest.showtimeID(), seatID, reservation.getId());
        }
        return createReservationConfirmation(reservation.getId() - 1);
    }

    public ReservationConfirmation createReservationConfirmation(Long id){
        Optional<Reservation> reservationOptional = reservationRepository.findById(id);
        if (reservationOptional.isEmpty()){
            throw new IllegalArgumentException("Please ensure that reservation was successfully saved");
        }
        Reservation reservation = reservationOptional.get();
        Hibernate.initialize(reservation.getTickets());
        List<Ticket> tickets = reservation.getTickets().stream().toList();
        Ticket ticket = tickets.get(0);
        ReservationConfirmation reservationConfirmation = new ReservationConfirmation();
        reservationConfirmation.setMovieName(ticket.getShowtime().getMovie().getName());
        reservationConfirmation.setMoviePoster(ticket.getShowtime().getMovie().getPoster());
        reservationConfirmation.setShowTime(ticket.getShowtime().getStartTime());
        reservationConfirmation.setUserEmail(reservation.getUser().getEmail());
        reservationConfirmation.setTheatreName(ticket.getShowtime().getTheatre().getName());

        for (Ticket ticketItem: tickets){
            reservationConfirmation.addSeatName(ticketItem.getSeat().getSeatNumber());
        }
        return reservationConfirmation;
    }

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
