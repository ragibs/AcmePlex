package com.acmeplex.acmeplex_backend;

import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Seat;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.repository.SeatRepository;
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

    @Autowired
    private SeatRepository seatRepository;

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

        Movie movie3 = new Movie();
        movie3.setName("Interstellar");
        movie3.setPoster("interstellar_poster.jpg");
        movie3.setDescription("A space exploration adventure by Christopher Nolan.");
        movie3.setReleaseDate(LocalDate.of(2014, 11, 7));
        movie3.setDuration(169);
        movie3.setGenre("Sci-Fi");

        movieRepository.saveAll(Arrays.asList(movie1, movie2, movie3));

        // Create Theatres
        Theatre theatre1 = new Theatre();
        theatre1.setName("AcmePlex Downtown");
        theatre1.setAddress("123 Main St, Downtown City");

        Theatre theatre2 = new Theatre();
        theatre2.setName("AcmePlex Uptown");
        theatre2.setAddress("456 Elm St, Uptown City");

        Theatre theatre3 = new Theatre();
        theatre3.setName("AcmePlex Midtown");
        theatre3.setAddress("789 Oak St, Midtown City");

        theatreRepository.saveAll(Arrays.asList(theatre1, theatre2, theatre3));

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

        Showtime showtime5 = new Showtime();
        showtime5.setStartTime(LocalDateTime.of(2024, 11, 20, 18, 0));
        showtime5.setMovie(movie3);
        showtime5.setTheatre(theatre3);

        showtimeRepository.saveAll(Arrays.asList(showtime1, showtime2, showtime3, showtime4, showtime5));

        // Add Seats for Showtimes
        createSeatsForShowtime(showtime1, 40); // 40 seats for showtime1
        createSeatsForShowtime(showtime2, 40); // 40 seats for showtime2
        createSeatsForShowtime(showtime3, 40); // 40 seats for showtime3
        createSeatsForShowtime(showtime4, 40); // 40 seats for showtime4
        createSeatsForShowtime(showtime5, 40); // 40 seats for showtime5

        System.out.println("Data populated successfully!");
    }

    private void createSeatsForShowtime(Showtime showtime, int seatCount) {
        for (int i = 1; i <= seatCount; i++) {
            Seat seat = new Seat();
            seat.setSeatNumber("Seat " + i);
            seat.setBooked(false); // Assuming seats are initially available
            seat.setShowtime(showtime);
            seatRepository.save(seat);
        }
    }
}