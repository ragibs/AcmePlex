package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
