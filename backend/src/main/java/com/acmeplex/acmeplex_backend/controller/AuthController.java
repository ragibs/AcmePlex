package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.LoginRequest;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
import com.acmeplex.acmeplex_backend.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

/**
 * The AuthController handles authentication-related endpoints, including login.
 * This controller provides JWT tokens for users upon successful authentication.
 */
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class AuthController {
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final RegisteredUserRepository registeredUserRepository;

    /**
     * Constructs an AuthController with the required dependencies.
     *
     * @param tokenService the service responsible for generating JWT tokens
     * @param authenticationManager the authentication manager used to verify credentials
     * @param registeredUserRepository the repository for accessing registered user data
     */
    public AuthController(TokenService tokenService, AuthenticationManager authenticationManager, RegisteredUserRepository registeredUserRepository) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.registeredUserRepository = registeredUserRepository;
    }

    /**
     * Authenticates a user and generates a JWT token if the credentials are valid.
     *
     * @param loginRequest the login request containing the user's email and password
     * @return JWT token if the credentials are valid, or an error message with the appropriate HTTP status code
     */
    @PostMapping("/login")
    public ResponseEntity<String> token(@RequestBody LoginRequest loginRequest){
        Optional<RegisteredUser> registeredUser = registeredUserRepository.findByEmail(loginRequest.email());
        if (registeredUser.isEmpty()){
            return ResponseEntity.status(404).body("There is no registered user associated with the given email");
        }
        Authentication authentication= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
        return ResponseEntity.status(200).body(tokenService.generateToken(authentication));
    }
}
