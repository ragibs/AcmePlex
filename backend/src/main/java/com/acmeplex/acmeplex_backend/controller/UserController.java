package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user){
        try{
            userService.registerUser(user.getEmail(), user.getPassword());
            return ResponseEntity.ok("Successfully Registered user");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Request Failed: " + e.getMessage());
        }


    }
}


