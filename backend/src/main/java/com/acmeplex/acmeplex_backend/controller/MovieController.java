package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.exception.MovieNotFoundException;
import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin("http://localhost:3000")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/movies")
    List<Movie> getAllMovies(){
        return movieService.getAllMovies();
    }

    @GetMapping("/movie/{id}")
    Movie getMovieById(@PathVariable Long id){
        return movieService.getMovieById(id);
    }

    // Get Showtime by movie
    @GetMapping("{movieId}/showtimes")
    public List<Showtime> getShowtimeForMovie(@PathVariable Long movieId) {
        return movieService.getShowtimesForMovie(movieId);
    }

}
