package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.exception.MovieNotFoundException;
import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
    }

    // Populate the movie table with some initial data
    public void populateMovies() {
        if (movieRepository.count() > 0) {
            // Movies are already populated, so return
            return;
        }

        // Placeholder URL for poster image (blank for now)
        String placeholderPosterUrl = "https://via.placeholder.com/150";  // Placeholder image

        Movie movie1 = new Movie("Inception", placeholderPosterUrl, "A mind-bending thriller by Christopher Nolan.", LocalDate.of(2010, 7, 16), 148, "Sci-Fi");
        Movie movie2 = new Movie("The Dark Knight", placeholderPosterUrl, "Batman faces off against the Joker.", LocalDate.of(2008, 7, 18), 152, "Action");
        Movie movie3 = new Movie("Titanic", placeholderPosterUrl, "A love story set aboard the ill-fated Titanic ship.", LocalDate.of(1997, 12, 19), 195, "Romance");
        Movie movie4 = new Movie("The Matrix", placeholderPosterUrl, "A hacker discovers the truth about reality.", LocalDate.of(1999, 3, 31), 136, "Sci-Fi");
        Movie movie5 = new Movie("The Godfather", placeholderPosterUrl, "The story of a powerful Italian-American crime family.", LocalDate.of(1972, 3, 24), 175, "Crime");

        // Save movies to the repository
        movieRepository.saveAll(List.of(movie1, movie2, movie3, movie4, movie5));
    }

}
