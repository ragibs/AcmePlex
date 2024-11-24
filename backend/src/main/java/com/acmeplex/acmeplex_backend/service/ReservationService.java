package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.Reservation;
import com.acmeplex.acmeplex_backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService{

    @Autowired
    private ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository){
        this.reservationRepository = reservationRepository;
    }

    public Reservation createReservation(Reservation res){
        return reservationRepository.save(res);
    }

    public Optional<Reservation> getReservationById(long Id){
        return reservationRepository.findById(Id);
    }

    public List<Reservation> getAllReservations(){
        return reservationRepository.findAll();
    }

    //need to implement ticket first so I can get the movie, then update it
    public Reservation updateReservation(Long id, Reservation updatedR){
        return reservationRepository.findById(id).map(
                reservation -> {
//                    reservation.setMovieName(updatedR.getMovieName());
//                    reservation.setSeatNumber(updatedR.getSeatNumber());
//                    reservation.setShowTime(updatedR.setShowTime());
                    //these are just temporary stubs, until ticket is properly implemented.
                    return reservationRepository.save(reservation);
                }).orElseThrow(()-> new RuntimeException("Reservation Not Found"));
    }

    public void deleteReservation(Long id){
        reservationRepository.deleteById(id);
    }
}
