package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r LEFT JOIN FETCH r.tickets WHERE r.id = :id")
    Optional<Reservation> getReservationTickets(Long id);
}
