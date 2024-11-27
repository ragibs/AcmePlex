package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.Reservation;
import com.acmeplex.acmeplex_backend.model.ReservationRequest;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.ReservationRepository;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService{

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    TicketService ticketService;
    @Autowired
    UserService userService;

    public ReservationService(ReservationRepository reservationRepository){
        this.reservationRepository = reservationRepository;
    }

//    public Reservation createReservation(Reservation res){
//        return reservationRepository.save(res);
//    }

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


    public void createReservation(ReservationRequest reservationRequest){
        if (!userService.userExists(reservationRequest.userEmail())){
            userService.registerUser(reservationRequest.userEmail());
        }
        Reservation reservation = new Reservation();
        reservation.setStatus("ACTIVE");
        reservation.setUser(userService.getUser(reservationRequest.userEmail()));
        reservation.setPaymentConfirmation(reservationRequest.paymentConfirmation());
        reservation.setReservationDate(LocalDateTime.now());
        for (Long seatID: reservationRequest.seatIDS()){
            ticketService.createTicket(reservationRequest.showtimeID(), seatID, reservation.getId());
        }
    }
}
