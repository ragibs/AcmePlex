package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.dto.UserRegistrationRequest;
import com.acmeplex.acmeplex_backend.model.PaymentInfo;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
import com.acmeplex.acmeplex_backend.service.RegisteredUserService;
import com.acmeplex.acmeplex_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

/**
 * The RegisteredUserController handles operations associated with registering a user.
 * This controller provides an endpoint for registering a new registered user along with their
 * associated payment information.
 */
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class RegisteredUserController {
    @Autowired
    private RegisteredUserService registeredUserService;
    @Autowired
    private RegisteredUserRepository registeredUserRepository;

    /**
     * Registers a new registered user with their payment information.
     * This endpoint takes a {@link UserRegistrationRequest} object that includes the user details
     * and payment information. If a user with the given email already exists, it returns a
     * {@code 409 Conflict} response. Otherwise, it registers the user and saves the payment
     * information, returning a {@code 201 Created} status upon success.
     *
     * @param userRegistrationRequest the registration request containing user details and payment information
     * @return a {@link ResponseEntity} with a success or error message
     */
    @PostMapping("/register/registereduser")
    public ResponseEntity<String> register(@RequestBody UserRegistrationRequest userRegistrationRequest) {
        RegisteredUser registeredUser = userRegistrationRequest.getRegisteredUser();
        PaymentInfo paymentInfo = userRegistrationRequest.getPaymentInfo();

        Optional<RegisteredUser> registeredUserExists = registeredUserRepository.findByEmail(registeredUser.getEmail());
        if (registeredUserExists.isPresent()) {
            return ResponseEntity.status(409).body("A registered user with this email address already exists");
        }
        registeredUserService.registerRegisteredUser(
                registeredUser.getEmail(),
                registeredUser.getPassword(),
                registeredUser.getName(),
                paymentInfo
        );
        return ResponseEntity.status(201).body("User and payment information registered successfully");
    }

}

