package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {
}
