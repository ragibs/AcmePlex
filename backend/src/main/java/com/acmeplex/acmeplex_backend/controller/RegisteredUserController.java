package com.acmeplex.acmeplex_backend.controller;

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

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class RegisteredUserController {
    @Autowired
    private RegisteredUserService registeredUserService;
    @Autowired
    private RegisteredUserRepository registeredUserRepository;

    @PostMapping("/register/registereduser")
    public ResponseEntity<String> register(@RequestBody RegisteredUser registeredUser){
        Optional<RegisteredUser> registeredUserExists = registeredUserRepository.findByEmail(registeredUser.getEmail());
        if (registeredUserExists.isPresent()){
            return ResponseEntity.status(409).body("A registered user with this email address already exists");
        }
        registeredUserService.registerRegisteredUser(
                registeredUser.getEmail(),
                registeredUser.getPassword(),
                registeredUser.getName());
        return ResponseEntity.status(201).body("User registered successfully");
    }

}

