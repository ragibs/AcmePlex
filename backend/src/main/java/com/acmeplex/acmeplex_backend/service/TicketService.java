package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.*;
import com.acmeplex.acmeplex_backend.repository.ReservationRepository;
import com.acmeplex.acmeplex_backend.repository.SeatRepository;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import com.acmeplex.acmeplex_backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    public Ticket getTicket(Long ticketID){
        Optional<Ticket> ticket = ticketRepository.findById(ticketID);
        if (ticket.isEmpty()){
            throw new IllegalArgumentException("Invalid Ticket ID");
        }
        return ticket.get();
    }

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

    public void cancelTickets(Set<Ticket> tickets){
        for (Ticket ticket: tickets){
            ticket.getSeat().setBooked(false);
            ticket.setStatus(TicketStatus.cancelled);
        }
    }
}
