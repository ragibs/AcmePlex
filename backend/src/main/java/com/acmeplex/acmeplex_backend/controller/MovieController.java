package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.exception.MovieNotFoundException;
import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.service.MovieService;
import com.acmeplex.acmeplex_backend.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * The MovieController handles REST API endpoints for managing movies and their showtimes.
 *
 * This controller provides endpoints for retrieving movies, adding movies, fetching showtimes,
 * and retrieving exclusive movie listings.
 */
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private ShowtimeService showtimeService;

    /**
     * Retrieves a list of all publicly available movies.
     *
     * @return a list of {@link Movie} objects representing all publicly available movies in the system
     */
    @GetMapping("/movies")
    List<Movie> getAllMovies(){
        return movieService.getAllMovies();
    }

    /**
     * Retrieves a movie by its unique ID.
     *
     * @param id the ID of the movie to retrieve
     * @return the {@link Movie} object if found
     * @throws MovieNotFoundException if the movie with the given ID does not exist
     */
    @GetMapping("/movie/{id}")
    Movie getMovieById(@PathVariable Long id){
        return movieService.getMovieById(id);
    }

    /**
     * Retrieves showtimes for a specific movie on a selected date.
     *
     * @param movieId the ID of the movie for which to retrieve showtimes
     * @param selectedDate the date for which to retrieve showtimes
     * @return a map containing the showtimes grouped by theater or other criteria
     */
    @GetMapping("movie/{movieId}/showtimes")
    public Map<String, Object> getShowtimesForMovie(
            @PathVariable Long movieId,
            @RequestParam String selectedDate) { // Accept the selected date as a query parameter
        return showtimeService.getShowtimesByMovieAndDate(movieId, selectedDate); // Pass date to service
    }

    /**
     * Adds a new movie to the system.
     *
     * @param movie the {@link Movie} object to add
     * @return the added {@link Movie} object
     */
    @PostMapping("movie/add")
    public Movie addMovie(@RequestBody Movie movie) {
        return movieService.addMovie(movie);
    }

    /**
     * Retrieves a list of exclusive movies available prior to public announcement exclusively to registered users
     *
     * These are the movies for which only 10% of the seats can be purchased and only by a registered user.
     *
     * @return a {@link ResponseEntity} containing a list of {@link Movie} objects if there are any exclusive movies currently in the system
     *         or an error message with {@link HttpStatus#BAD_REQUEST} if there are no exclusive movies
     */
    @GetMapping("/movies/exclusive")
    public ResponseEntity<?> getExclusiveMovie(){
        try{
            List<Movie> movies = movieService.returnExclusiveMovies();
            return new ResponseEntity<>(movies, HttpStatus.OK);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }
}


