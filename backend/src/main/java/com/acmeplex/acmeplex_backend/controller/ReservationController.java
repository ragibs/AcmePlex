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

//    @PostMapping
//    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation){
//        Reservation newRes = reservationService.createReservation(reservation);
//        return ResponseEntity.status(HttpStatus.CREATED).body(newRes);
//    }
    @GetMapping("/{id}")
    public Optional<Reservation> getReservationByID(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }

    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id,
            @RequestBody Reservation updatedReservation) {
        try {
            Reservation reservation = reservationService.updateReservation(id, updatedReservation);
            return ResponseEntity.ok(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest reservationRequest){
        reservationService.createReservation(reservationRequest);
        return new ResponseEntity<>("Reservation created successfully", HttpStatus.CREATED);
    }


    //depeneds if we need this, do we need to get all Reservations, or only for a certain movie, get them maybe
//    public List<Reservation> getAllReservations(){
//
//    }


}
