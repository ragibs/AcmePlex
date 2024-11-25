package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.Ticket;
import com.acmeplex.acmeplex_backend.model.TicketStatus;
import com.acmeplex.acmeplex_backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/ticket")
@CrossOrigin("http://localhost:3000")
public class TicketController
{
    @Autowired
    private TicketService ticketService;

    @GetMapping("/getticket/{ticketID}")
    public ResponseEntity<?> getTicket(@PathVariable Long ticketID){
        Ticket ticket = new Ticket();
        try{
            ticket = ticketService.getTicket(ticketID);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(ticket, HttpStatus.OK);
    }

    @PostMapping("/createticket")
    public ResponseEntity<?> createTicket(@RequestBody Ticket ticket){
        Ticket createdTicket = new Ticket();
        try{
            createdTicket = ticketService.createTicket(ticket);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }

    @PostMapping("/createmultiple")
    public ResponseEntity<?> createTickets(@RequestBody List<Ticket> tickets){
        List<Ticket> createdTickets = new ArrayList<>();
        for (Ticket ticket: tickets){
            try{
                Ticket createdTicket = ticketService.createTicket(ticket);
                createdTickets.add(createdTicket);
            } catch (IllegalArgumentException exception){
                ticketService.deleteTickets(createdTickets);
                return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(createdTickets, HttpStatus.CREATED);
    }

    @PutMapping("/updateticket")
    public ResponseEntity<String> updateTicketStatus(Long ticketID, String updatedStatus){
        try {
            ticketService.updateStatus(ticketID, updatedStatus);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(400).body(exception.getMessage());
        }
        return ResponseEntity.status(200).body("Ticket Status updated successfully");
    }
}
