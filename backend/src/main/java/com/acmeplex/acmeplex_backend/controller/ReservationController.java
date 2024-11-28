package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.Reservation;
import com.acmeplex.acmeplex_backend.model.ReservationConfirmation;
import com.acmeplex.acmeplex_backend.model.ReservationRequest;
import com.acmeplex.acmeplex_backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/reservation")
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @GetMapping("/get/{email}/{reservationID}")
    public ResponseEntity<?> getReservation(@PathVariable String email, @PathVariable Long reservationID){

        try{
            ReservationConfirmation reservationConfirmation = reservationService.getReservationDetails(email, reservationID);
            return new ResponseEntity<>(reservationConfirmation, HttpStatus.OK);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest reservationRequest){
        try{
            Long reservationID = reservationService.createReservation(reservationRequest);
            return new ResponseEntity<>(reservationID, HttpStatus.CREATED);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>("Please check the reservation request" + exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/cancel/{reservationID}")
    public ResponseEntity<?> cancelReservation(@PathVariable Long reservationID){
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
