package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.ObserverPattern.Announcement;
import com.acmeplex.acmeplex_backend.exception.MovieNotFoundException;
import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import com.acmeplex.acmeplex_backend.repository.TheatreRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private Announcement announcementService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SeatService seatService;

    @Autowired
    private TheatreRepository theatreRepository;

    public List<Movie> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        if (movies.isEmpty()){
            throw new IllegalArgumentException("There are currently no movies in the database");
        }
        List<Movie> normalMovies = new ArrayList<>();
        for (Movie movie: movies){
            if (!movie.isExclusive()){
                normalMovies.add(movie);
            }
        }

        return normalMovies;
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
    }

    // Add a movie and notify all users (send emails)
    public Movie addMovie(Movie movie) {
        Movie savedMovie = movieRepository.save(movie);


        String announcement = movie.getName();
        announcementService.notifyObservers(announcement);


        // Fetch one theatre (assuming at least one exists)
        Optional<Theatre> optionalTheatre = theatreRepository.findAll().stream().findFirst();
        if (optionalTheatre.isPresent()) {
            Theatre theatre = optionalTheatre.get();


            // Create a single showtime
            Showtime showtime = new Showtime();
            showtime.setStartTime(LocalDate.now().plusDays(1).atTime(19, 0)); // Default: Tomorrow at 7:00 PM
            showtime.setMovie(savedMovie);
            showtime.setTheatre(theatre);


            // Save the showtime
            Showtime savedShowtime = showtimeRepository.save(showtime);


            seatService.createSeatsForShowtime(savedShowtime, 40);
        }


        return savedMovie;
    }


    // Send email for announcement (called from User or RegisteredUser)
    public void sendEmailForAnnouncement(String email, String subject, String announcement, String templateName) {
        try {
            emailService.sendEmailForAnnouncement(email, subject, announcement, templateName); // Call the EmailService to send the email
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public List<Movie> returnExclusiveMovies(){
        List<Movie> movies = movieRepository.findAll();
        if (movies.isEmpty()){
            throw new IllegalArgumentException("There are currently no movies in the database");
        }
        List<Movie> exclusiveMovies = new ArrayList<>();
        for (Movie movie: movies){
            if (movie.isExclusive()){
                exclusiveMovies.add(movie);
            }
        }

        return exclusiveMovies;

    }


}
