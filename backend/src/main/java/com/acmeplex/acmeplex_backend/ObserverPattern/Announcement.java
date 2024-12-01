package com.acmeplex.acmeplex_backend.ObserverPattern;

import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import com.acmeplex.acmeplex_backend.service.MovieService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * The Announcement class implements the Subject interface to manage
 * public and pre-public announcements for normal and registered users.
 * This service is used to update registered users with pre public announcements as soon as a new movie is added
 * while normal users receive a public announcement after the pre public period has passed
 */
@Service
public class Announcement implements Subject{
    private List<Observer> registeredUsers = new ArrayList<>();
    private List<Observer> regularUsers = new ArrayList<>();


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;


    @Autowired
    @Lazy
    private MovieService movieService;


    private String announcement;

    /**
     * Initializes the announcement service by attaching all users as observers.
     */
    @PostConstruct
    public void initialize() {
        List<User> allUsers = userRepository.findAll();  // Retrieve all users from the DB
        for (User user : allUsers) {
            if (user instanceof RegisteredUser) {
                attach((RegisteredUser) user);  // RegisteredUser
            } else {
                attach(user);  // Regular User
            }
        }
    }

    /**
     * Attaches all observers to their corresponding notification list.
     *
     * @param observer the observer to be added
     */
    @Override
    public void attach(Observer observer) {
        if (observer instanceof RegisteredUser) {
            registeredUsers.add(observer);  // Registered users
        } else {
            regularUsers.add(observer);  // Regular users
        }
    }

    /**
     * Detaches an observer from the notification list.
     *
     * @param observer the observer to be removed
     */
    @Override
    public void detach(Observer observer) {
        if (observer instanceof RegisteredUser) {
            registeredUsers.remove(observer);
        } else {
            regularUsers.remove(observer);
        }
    }

    /**
     * Notifies all observers about an announcement.
     * Registered users receive pre-public announcement, while regular users receive public announcements.
     *
     * @param announcement the announcement to be sent to observers
     */
    @Override
    public void notifyObservers(String announcement) {
        // Notify registered users first (a couple of days earlier)
        for (Observer observer : registeredUsers) {
            observer.update(announcement);
            movieService.sendEmailForAnnouncement(observer.getEmail(), "Movie Announcement", announcement, "pre-public-announcement");
        }


        // Schedule regular users to be notified after a delay (e.g., 2 days later)
        // Here we delay the notification to regular users
        notifyRegularUsersWithDelay(announcement, 1);


    }


    /**
     * Notifies regular users after pre public announcement period has concluded.
     *
     * @param announcement the announcement to be sent
     * @param minutesDelay the delay in minutes before notifying regular users
     */
    private void notifyRegularUsersWithDelay(String announcement, int minutesDelay) {
        // Use a separate thread or scheduling service to delay the notification to regular users
        new Thread(() -> {
            try {
                Thread.sleep(minutesDelay * 60 * 1000);

                Movie movie = movieRepository.findByName(announcement);
                if (movie != null) {
                    // Change movie's isExclusive to false
                    movie.setExclusive(false);
                    movieRepository.save(movie);  // Save the updated movie
                }

                for (Observer observer : regularUsers) {
                    observer.update(announcement);
                    movieService.sendEmailForAnnouncement(observer.getEmail(), "Movie Announcement", announcement, "public-announcement");
                }

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }


}

