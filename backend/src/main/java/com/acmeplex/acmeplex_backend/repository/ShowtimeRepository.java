package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    List<Showtime> findByMovieId(Long movieId);
    List<Showtime> findByTheatreId(Long theatreId);

    // Custom query to filter showtimes by date range (startTime)
    @Query("SELECT s FROM Showtime s WHERE s.theatre.id = :theatreId AND s.startTime BETWEEN :startDate AND :endDate")
    List<Showtime> findByTheatreIdAndDateRange(Long theatreId, LocalDateTime startDate, LocalDateTime endDate);
    // Custom query to filter showtimes by movieId and date range (startTime)
    @Query("SELECT s FROM Showtime s WHERE s.movie.id = :movieId AND s.startTime BETWEEN :startDate AND :endDate")
    List<Showtime> findByMovieIdAndDateRange(Long movieId, LocalDateTime startDate, LocalDateTime endDate);
}
