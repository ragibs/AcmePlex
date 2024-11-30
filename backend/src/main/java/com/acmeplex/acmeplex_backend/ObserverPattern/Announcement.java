package com.acmeplex.acmeplex_backend.ObserverPattern;

import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import com.acmeplex.acmeplex_backend.service.MovieService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class Announcement implements Subject{
    private List<Observer> registeredUsers = new ArrayList<>();
    private List<Observer> regularUsers = new ArrayList<>();


    @Autowired
    private UserRepository userRepository;


    @Autowired
    @Lazy
    private MovieService movieService;


    private String announcement;


    // Attach all users (regular and registered) at the start
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


    @Override
    public void attach(Observer observer) {
        if (observer instanceof RegisteredUser) {
            registeredUsers.add(observer);  // Registered users
        } else {
            regularUsers.add(observer);  // Regular users
        }
    }


    @Override
    public void detach(Observer observer) {
        if (observer instanceof RegisteredUser) {
            registeredUsers.remove(observer);
        } else {
            regularUsers.remove(observer);
        }
    }


    @Override
    public void notifyObservers(String announcement) {
        // Notify registered users first (a couple of days earlier)
        for (Observer observer : registeredUsers) {
            observer.update(announcement);
            movieService.sendEmailForAnnouncement(observer.getEmail(), "Movie Announcement", announcement, "pre-public-announcement");
        }


        // Schedule regular users to be notified after a delay (e.g., 2 days later)
        // Here we delay the notification to regular users
        notifyRegularUsersWithDelay(announcement, 2); // Delay of 2 days for regular users


    }


    // Method to notify regular users after a delay
    private void notifyRegularUsersWithDelay(String announcement, int minutesDelay) {
        // Use a separate thread or scheduling service to delay the notification to regular users
        new Thread(() -> {
            try {
                Thread.sleep(minutesDelay * 60 * 1000); // Convert days to milliseconds daysDelay * 24 * 60 * 60 * 1000
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

