package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
}
