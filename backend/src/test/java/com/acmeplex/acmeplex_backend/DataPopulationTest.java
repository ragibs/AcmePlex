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
import java.util.List;

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
        movie1.setPoster("https://i.ebayimg.com/00/s/MTYwMFgxMDk3/z/LlUAAOSwm8VUwoRL/$_57.JPG?set_id=880000500F");
        movie1.setDescription("A mind-bending thriller by Christopher Nolan.");
        movie1.setReleaseDate(LocalDate.of(2010, 7, 16));
        movie1.setDuration(148);
        movie1.setGenre("Sci-Fi");

        Movie movie2 = new Movie();
        movie2.setName("The Dark Knight");
        movie2.setPoster("https://m.media-amazon.com/images/I/51rF2-tvXVL._AC_UF1000,1000_QL80_.jpg");
        movie2.setDescription("A superhero crime thriller by Christopher Nolan.");
        movie2.setReleaseDate(LocalDate.of(2008, 7, 18));
        movie2.setDuration(152);
        movie2.setGenre("Action");

        Movie movie3 = new Movie();
        movie3.setName("Interstellar");
        movie3.setPoster("https://cdn.mos.cms.futurecdn.net/iQMcSeLoiJUZ27v6xRxqCP-1200-80.jpg");
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

        theatreRepository.saveAll(Arrays.asList(theatre1, theatre2));

        // Define the specific day: Dec 3, 2024
        LocalDateTime startDate = LocalDateTime.of(2024, 12, 3, 10, 0); // First showtime on Dec 3, 2024 at 10:00 AM
        List<Theatre> theatres = Arrays.asList(theatre1, theatre2);  // List of theatres
        List<Movie> movies = Arrays.asList(movie1, movie2, movie3); // List of movies

        // Create showtimes: 3 showtimes per movie in both theatres, all on Dec 3, 2024
        for (Movie movie : movies) {
            for (Theatre theatre : theatres) {
                // Create 3 showtimes for each movie in each theatre
                for (int i = 0; i < 3; i++) {
                    Showtime showtime = new Showtime();
                    // All showtimes will be on Dec 3, 2024 but spaced by 3 hours
                    showtime.setStartTime(startDate.plusHours(i * 3));
                    showtime.setMovie(movie);
                    showtime.setTheatre(theatre);
                    showtimeRepository.save(showtime);

                    // Create 40 seats for each showtime
                    createSeatsForShowtime(showtime, 40);
                }
            }
        }

        System.out.println("Data populated successfully!");
    }

    private void createSeatsForShowtime(Showtime showtime, int seatCount) {
        int seatsPerRow = 10; // Number of seats per row
        char currentRow = 'A'; // Starting row letter

        for (int i = 1; i <= seatCount; i++) {
            // Generate seat number in the format "A1", "A2", ..., "B1", etc.
            String seatNumber = currentRow + String.valueOf((i - 1) % seatsPerRow + 1);

            Seat seat = new Seat();
            seat.setSeatNumber(seatNumber);
            seat.setBooked(false); // Initially all seats are available
            seat.setShowtime(showtime);
            seatRepository.save(seat);

            // Move to the next row after seatsPerRow
            if (i % seatsPerRow == 0) {
                currentRow++;
            }
        }
    }
}
