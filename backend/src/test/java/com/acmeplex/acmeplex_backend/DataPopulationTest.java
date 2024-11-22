package com.acmeplex.acmeplex_backend;

import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import com.acmeplex.acmeplex_backend.repository.TheatreRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;

@SpringBootTest
public class DataPopulationTest {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TheatreRepository theatreRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Test
    public void populateData() {
        // Create Movies
        Movie movie1 = new Movie();
        movie1.setName("Inception");
        movie1.setPoster("inception_poster.jpg");
        movie1.setDescription("A mind-bending thriller by Christopher Nolan.");
        movie1.setReleaseDate(LocalDate.of(2010, 7, 16));
        movie1.setDuration(148);
        movie1.setGenre("Sci-Fi");

        Movie movie2 = new Movie();
        movie2.setName("The Dark Knight");
        movie2.setPoster("dark_knight_poster.jpg");
        movie2.setDescription("A superhero crime thriller by Christopher Nolan.");
        movie2.setReleaseDate(LocalDate.of(2008, 7, 18));
        movie2.setDuration(152);
        movie2.setGenre("Action");

        movieRepository.saveAll(Arrays.asList(movie1, movie2));

        // Create Theatres
        Theatre theatre1 = new Theatre();
        theatre1.setName("AcmePlex Downtown");
        theatre1.setAddress("123 Main St, Downtown City");

        Theatre theatre2 = new Theatre();
        theatre2.setName("AcmePlex Uptown");
        theatre2.setAddress("456 Elm St, Uptown City");

        theatreRepository.saveAll(Arrays.asList(theatre1, theatre2));

        // Create Showtimes
        Showtime showtime1 = new Showtime();
        showtime1.setStartTime(LocalDateTime.of(2024, 11, 18, 19, 0));
        showtime1.setMovie(movie1);
        showtime1.setTheatre(theatre1);

        Showtime showtime2 = new Showtime();
        showtime2.setStartTime(LocalDateTime.of(2024, 11, 18, 21, 30));
        showtime2.setMovie(movie1);
        showtime2.setTheatre(theatre2);

        Showtime showtime3 = new Showtime();
        showtime3.setStartTime(LocalDateTime.of(2024, 11, 19, 18, 0));
        showtime3.setMovie(movie2);
        showtime3.setTheatre(theatre1);

        Showtime showtime4 = new Showtime();
        showtime4.setStartTime(LocalDateTime.of(2024, 11, 19, 20, 30));
        showtime4.setMovie(movie2);
        showtime4.setTheatre(theatre2);

        showtimeRepository.saveAll(Arrays.asList(showtime1, showtime2, showtime3, showtime4));

        System.out.println("Data populated successfully!");
    }
}