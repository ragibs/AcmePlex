package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.Reservation;
import com.acmeplex.acmeplex_backend.model.ReservationRequest;
import com.acmeplex.acmeplex_backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reservation")
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class ReservationController {
    @Autowired
    public ReservationService reservationService;

    @GetMapping("/{id}")
    public Optional<Reservation> getReservationByID(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest reservationRequest){
        try{
            reservationService.createReservation(reservationRequest);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>("Please check the reservation request" + exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("Reservation created successfully", HttpStatus.CREATED);
    }

    @PutMapping("/cancel")
    public ResponseEntity<?> cancelReservation(@RequestParam Long reservationID){
        if (!(reservationService.reservationCanBeCancelled(reservationID))){
            return new ResponseEntity<>("This reservation can no longer be cancelled", HttpStatus.NOT_ACCEPTABLE);
        }
        try {
            String couponCode = reservationService.cancelReservation(reservationID);
            return new ResponseEntity<>(couponCode, HttpStatus.OK);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
