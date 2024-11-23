package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.service.RegisteredUserService;
import com.acmeplex.acmeplex_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("http://localhost:3000")
public class RegisteredUserController {
    @Autowired
    private RegisteredUserService registeredUserService;
    @PostMapping("/register/registereduser")
    public ResponseEntity<String> register(@RequestBody RegisteredUser registeredUser){
        registeredUserService.registerRegisteredUser(
                registeredUser.getEmail(),
                registeredUser.getPassword(),
                registeredUser.getAddress(),
                registeredUser.getName());
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

}

