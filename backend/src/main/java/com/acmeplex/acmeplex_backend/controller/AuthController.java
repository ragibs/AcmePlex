package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        authService.register(user.getUsername(), user.getEmail(), user.getPassword(), user.getRole());
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    // Login user and return JWT token
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        String token = authService.login(user.getUsername(), user.getPassword());
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
}
