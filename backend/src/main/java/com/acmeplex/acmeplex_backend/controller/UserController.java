package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import com.acmeplex.acmeplex_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    UserRepository userRepository;
    @PostMapping("/register/user")
    public ResponseEntity<String> register(@RequestBody User user){
        Optional<User> userExists = userRepository.findByEmail(user.getEmail());
        if (userExists.isPresent()){
            return ResponseEntity.status(409).body("A user with this email address already exists");
        }
        userService.registerUser(user.getEmail());
        return ResponseEntity.status(201).body("User registered successfully");
    }


}