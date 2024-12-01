package com.acmeplex.acmeplex_backend.service;
import com.acmeplex.acmeplex_backend.ObserverPattern.Announcement;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.util.Optional;

/**
 * Service class responsible for user-related operations such as checking existence, and retrieving user details.
 * It also integrates with an Announcement service to notify users of certain events.
 */
@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private Announcement announcementService;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Registers a new user by their email and saves the user to the repository.
     * Additionally, the user is attached to the Announcement service for notifications.
     *
     * @param email The email of the user to register.
     */
    public void registerUser(String email){
        User user = new User();
        user.setEmail(email);
        userRepository.save(user);

        announcementService.attach(user);
    }

    /**
     * Checks if a user with the given email already exists in the repository.
     *
     * @param email The email of the user to check for existence.
     * @return true if the user exists, false otherwise.
     */
    public boolean userExists(String email){
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent();
    }

    /**
     * Retrieves a user by their email.
     *
     * @param Email The email of the user to retrieve.
     * @return The user associated with the given email.
     * @throws IllegalArgumentException if no user with the given email is found.
     */
    public User getUser(String Email){
        return userRepository.findByEmail(Email)
                .orElseThrow(()-> new IllegalArgumentException("Invalid user email"));
    }
}