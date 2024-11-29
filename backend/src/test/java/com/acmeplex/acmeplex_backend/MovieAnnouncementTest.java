package com.acmeplex.acmeplex_backend;

import com.acmeplex.acmeplex_backend.ObserverPattern.Announcement;
import com.acmeplex.acmeplex_backend.ObserverPattern.Observer;
import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import com.acmeplex.acmeplex_backend.service.EmailService;
import com.acmeplex.acmeplex_backend.service.MovieService;
import com.acmeplex.acmeplex_backend.service.RegisteredUserService;
import com.acmeplex.acmeplex_backend.service.UserService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;


@SpringBootTest
public class MovieAnnouncementTest {
    @Autowired
    private MovieService movieService;

    @MockBean
    private MovieRepository movieRepository;

    @MockBean
    private Announcement announcementService;

    @MockBean
    private EmailService emailService;

    @MockBean
    private RegisteredUserRepository registeredUserRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private Observer observer;

    @Autowired
    private UserService userService;

    @Autowired
    private RegisteredUserService registeredUserService;

    @Test
    public void testAddMovieAndNotifyObservers() throws MessagingException {
        // Arrange
        Movie movie = new Movie();
        movie.setName("Avatar 3");

        // Register users (attaches them as observers)
        userService.registerUser("regularUser@example.com");
        registeredUserService.registerRegisteredUser("registeredUser@example.com", "password123", "John Doe");

        // Mock repository save behavior
        Mockito.when(movieRepository.save(Mockito.any(Movie.class))).thenReturn(movie);

        // Act
        movieService.addMovie(movie);

        String announcement = "New movie added: " + movie.getName();
        announcementService.notifyObservers(announcement);



        // Assert
        Mockito.verify(emailService, Mockito.times(1))
                .sendEmailForAnnouncement("regularUser@example.com", "Movie Announcement", "New movie added: Avatar 3");
        Mockito.verify(emailService, Mockito.times(1))
                .sendEmailForAnnouncement("registeredUser@example.com", "Movie Announcement (Early)", "New movie added: Avatar 3");
    }
}
