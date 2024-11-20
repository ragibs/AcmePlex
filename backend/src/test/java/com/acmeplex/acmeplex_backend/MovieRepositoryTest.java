package com.acmeplex.acmeplex_backend;

import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.repository.TheatreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class MovieRepositoryTest {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TheatreRepository theatreRepository;

    @BeforeEach
    public void setup() {
        // Clear the database before each test
        movieRepository.deleteAll();
        theatreRepository.deleteAll();
    }

    @Test
    public void testSaveMovieAndTheatre() {
        // Create a Theatre
        Theatre theatre = new Theatre();
        theatre.setName("AcmePlex Theater 1");
        theatre.setAddress("123 Main St, Cityville");

        // Save the Theatre to the database first
        Theatre savedTheatre = theatreRepository.save(theatre);

        // Create a Movie
        Movie movie = new Movie();
        movie.setName("Inception");
        movie.setPoster("inception_poster.jpg");
        movie.setDescription("A mind-bending thriller.");
        movie.setReleaseDate(java.time.LocalDate.of(2010, 7, 16));
        movie.setDuration(148);
        movie.setGenre("Sci-Fi");

        // Link the Movie and Theatre (now that Theatre is saved)
        movie.getTheatres().add(savedTheatre);
        savedTheatre.getMovies().add(movie);

        // Save Movie to the database
        movieRepository.save(movie);

        // Retrieve the Movie from the database
        Movie savedMovie = movieRepository.findById(movie.getId()).orElse(null);
        assertNotNull(savedMovie, "Movie should be saved and retrieved");

        // Retrieve the Theatre from the database
        Theatre retrievedTheatre = theatreRepository.findById(savedTheatre.getId()).orElse(null);
        assertNotNull(retrievedTheatre, "Theatre should be saved and retrieved");

        // Check if the saved Movie and Theatre are correctly linked by comparing IDs
        assertEquals(savedMovie.getId(), movie.getId(), "Movie ID should be the same after save");
        assertEquals(retrievedTheatre.getId(), savedTheatre.getId(), "Theatre ID should be the same after save");
    }
}
