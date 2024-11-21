package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.exception.MovieNotFoundException;
import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
    }

    // Get all theaters for a specific movie
    public Set<Theatre> getTheatersForMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        return movie.getTheatres();
    }

    // Get showtimes for movie
    public List<Showtime> getShowtimesForMovie(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

}
