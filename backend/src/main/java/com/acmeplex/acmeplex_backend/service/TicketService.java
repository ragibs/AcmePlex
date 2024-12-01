package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.*;
import com.acmeplex.acmeplex_backend.repository.ReservationRepository;
import com.acmeplex.acmeplex_backend.repository.SeatRepository;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import com.acmeplex.acmeplex_backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service class responsible for managing and processing ticket-related operations.
 * This includes creating, updating, retrieving tickets as well reverting creation through delete in case of errors
 */
@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final ReservationRepository reservationRepository;

    public TicketService(TicketRepository ticketRepository, ShowtimeRepository showtimeRepository, SeatRepository seatRepository, ReservationRepository reservationRepository) {
        this.ticketRepository = ticketRepository;
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.reservationRepository = reservationRepository;
    }

    /**
     * Creates a new ticket for a specific showtime, seat, and reservation.
     * Marks the seat as booked and saves the ticket in the repository.
     *
     * @param showtimeID   The ID of the showtime for the ticket.
     * @param seatID       The ID of the seat to be booked.
     * @param reservationID The ID of the reservation associated with the ticket.
     * @throws IllegalArgumentException if any of the provided IDs are invalid or if the seat is already booked.
     */
    public void createTicket(Long showtimeID, Long seatID, Long reservationID){
        Showtime showtime = showtimeRepository.findById(showtimeID)
                .orElseThrow(() -> new IllegalArgumentException("Invalid showtime ID"));
        Seat seat = seatRepository.findById(seatID)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Seat ID"));
        Reservation reservation = reservationRepository.findById(reservationID)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reservation ID"));
        if (seat.isBooked()){
            throw new IllegalArgumentException("This seat has already been booked");
        }

        seat.setBooked(true);
        seatRepository.save(seat);
        Ticket createdTicket = new Ticket();
        createdTicket.setStatus(TicketStatus.active);
        createdTicket.setShowtime(showtime);
        createdTicket.setSeat(seat);
        createdTicket.setReservation(reservation);
        ticketRepository.save(createdTicket);
    }

    /**
     * Updates the status of an existing ticket.
     * The status can be updated to "active", "used", or "cancelled".
     *
     * @param ticketID      The ID of the ticket to be updated.
     * @param updatedStatus The new status to be applied to the ticket.
     * @throws IllegalArgumentException if the provided status is invalid.
     */
    public void updateStatus(Long ticketID, String updatedStatus){
        Ticket ticket = ticketRepository.findById(ticketID)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Ticket ID"));
        switch (updatedStatus) {
            case "cancelled" -> ticket.setStatus(TicketStatus.cancelled);
            case "used" -> ticket.setStatus(TicketStatus.used);
            case "active" -> ticket.setStatus(TicketStatus.active);
            default ->
                    throw new IllegalArgumentException("Invalid status option for ticket. Ticket status can only be active, used or cancelled");
        }
        ticketRepository.save(ticket);
    }

    /**
     * Retrieves the ticket associated with the provided ticket ID.
     *
     * @param ticketID The ID of the ticket to be retrieved.
     * @return The ticket corresponding to the provided ID.
     * @throws IllegalArgumentException if no ticket with the provided ID is found.
     */
    public Ticket getTicket(Long ticketID){
        Optional<Ticket> ticket = ticketRepository.findById(ticketID);
        if (ticket.isEmpty()){
            throw new IllegalArgumentException("Invalid Ticket ID");
        }
        return ticket.get();
    }

    /**
     * Deletes a list of tickets and unbooks the corresponding seats. Only to be used in creation logic when the request fails to maintain data integrity.
     *
     * @param tickets The list of tickets to be deleted.
     */
    public void deleteTickets(List<Ticket> tickets){
        if (tickets.isEmpty()){
            return;
        }
        for (Ticket ticket:tickets){
            Seat seat = ticket.getSeat();
            seat.setBooked(false);
            seatRepository.save(seat);
            ticketRepository.delete(ticket);
        }
    }

    /**
     * Cancels a set of tickets and unbooks the corresponding seats.
     *
     * @param tickets The set of tickets to be cancelled.
     */
    public void cancelTickets(Set<Ticket> tickets){
        for (Ticket ticket: tickets){
            ticket.getSeat().setBooked(false);
            ticket.setStatus(TicketStatus.cancelled);
        }
    }

    public String getTicketName(Reservation reservation){
        return "";
    }
}
