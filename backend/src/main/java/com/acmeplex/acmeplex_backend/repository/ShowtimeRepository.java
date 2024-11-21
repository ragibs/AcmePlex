package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    List<Showtime> findByMovieId(Long movieId);
}
