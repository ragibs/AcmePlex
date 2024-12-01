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

/**
 * Service class responsible for managing movie-related operations,
 * including retrieving movies, adding new movies, and sending movie announcements.
 */
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

    /**
     * Retrieves all movies in the database that are not exclusive.
     *
     * @return a list of non-exclusive movies
     * @throws IllegalArgumentException if no movies are found in the database
     */
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

    /**
     * Retrieves a movie by its ID.
     *
     * @param id the ID of the movie
     * @return the movie with the specified ID
     * @throws MovieNotFoundException if no movie with the specified ID is found
     */
    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
    }

    /**
     * Adds a new movie to the database and notifies users about the new movie via email.
     * It also creates a default showtime and seats for the movie in the first available theatre.
     *
     * @param movie the movie to be added
     * @return the saved movie
     */
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


    /**
     * Sends an email announcement about a new movie to the specified email address.
     *
     * @param email the recipient's email address
     * @param subject the subject of the email
     * @param announcement the content of the announcement
     * @param templateName the name of the Thymeleaf template to process for the email body
     */
    public void sendEmailForAnnouncement(String email, String subject, String announcement, String templateName) {
        try {
            emailService.sendEmailForAnnouncement(email, subject, announcement, templateName); // Call the EmailService to send the email
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    /**
     * Retrieves all exclusive movies from the database.
     *
     * @return a list of exclusive movies
     * @throws IllegalArgumentException if no movies are found in the database
     */
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
