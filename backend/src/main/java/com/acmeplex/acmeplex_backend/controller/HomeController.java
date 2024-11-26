package com.acmeplex.acmeplex_backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})

public class HomeController {

    @GetMapping("/")
    public String home(){
        return "JWT ";
    }

    @GetMapping("/home")
    public String lockedHome() {return "JWT after using token auth";}
}
