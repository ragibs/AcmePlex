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

/**
 * The ReservationController handles operations related to customer reservations.
 * This includes creating new reservations, retrieving reservation details,
 * and canceling existing reservations.
 */
@RestController
@RequestMapping("/reservation")
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    /**
     * Retrieves the details of a specific reservation for a user.
     *
     * @param email the email address of the user associated with the reservation
     * @param reservationID the unique ID of the reservation
     * @return a {@link ResponseEntity} containing the {@link ReservationConfirmation} if found, or an error message if not
     */
    @GetMapping("/get/{email}/{reservationID}")
    public ResponseEntity<?> getReservation(@PathVariable String email, @PathVariable Long reservationID){

        try{
            ReservationConfirmation reservationConfirmation = reservationService.getReservationDetails(email, reservationID);
            return new ResponseEntity<>(reservationConfirmation, HttpStatus.OK);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Creates a new reservation.
     *
     * @param reservationRequest the {@link ReservationRequest} containing reservation details
     * @return a {@link ResponseEntity} with the reservation ID if successful, or an error message if the request is invalid
     */
    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest reservationRequest){
        try{
            Long reservationID = reservationService.createReservation(reservationRequest);
            return new ResponseEntity<>(reservationID, HttpStatus.CREATED);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>("Please check the reservation request " + exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Cancels an existing reservation if it is eligible for cancellation. Issues a coupon code with appropriate value
     * if a registration is cancelled successfully.
     *
     * @param reservationID the unique ID of the reservation to be canceled
     * @return a {@link ResponseEntity} with a coupon code if cancellation is successful, or an error message otherwise
     */
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
