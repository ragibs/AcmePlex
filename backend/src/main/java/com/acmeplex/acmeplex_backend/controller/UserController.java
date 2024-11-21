package com.acmeplex.acmeplex_backend.controller;

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

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user){
        userService.register(user.getEmail(), user.getPassword());
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user){
        String token = userService.login(user.getEmail(), user.getPassword());
        return  new ResponseEntity<>(token, HttpStatus.OK);
    }


}
