package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.ObserverPattern.Announcement;
import com.acmeplex.acmeplex_backend.exception.MovieNotFoundException;
import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import jakarta.mail.MessagingException;
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

    @Autowired
    private Announcement announcementService;

    @Autowired
    private EmailService emailService;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException(id));
    }

    // Add a movie and notify all users (send emails)
    public Movie addMovie(Movie movie) {
        Movie savedMovie = movieRepository.save(movie);


        // Trigger announcement when a movie is added
        String announcement = movie.getName();
        announcementService.notifyObservers(announcement);


        return savedMovie;
    }


    // Send email for announcement (called from User or RegisteredUser)
    public void sendEmailForAnnouncement(String email, String subject, String announcement) {
        try {
            emailService.sendEmailForAnnouncement(email, subject, announcement); // Call the EmailService to send the email
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }


}
