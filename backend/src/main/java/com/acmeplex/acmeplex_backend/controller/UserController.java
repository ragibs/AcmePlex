package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("/register/user")
    public ResponseEntity<String> register(@RequestBody User user){
        userService.registerUser(user.getEmail());
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }


}