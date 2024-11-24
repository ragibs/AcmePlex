package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.LoginRequest;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
import com.acmeplex.acmeplex_backend.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class AuthController {
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final RegisteredUserRepository registeredUserRepository;

    public AuthController(TokenService tokenService, AuthenticationManager authenticationManager, RegisteredUserRepository registeredUserRepository) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.registeredUserRepository = registeredUserRepository;
    }

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
