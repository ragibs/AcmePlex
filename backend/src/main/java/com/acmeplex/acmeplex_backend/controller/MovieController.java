package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    @GetMapping("/movies")
    List<Movie> getAllUsers(){
        return movieRepository.findAll();
    }

    @GetMapping("/movie/{id}")
    Movie getUserById(@PathVariable Long id){
        return movieRepository.findById(id)
                .orElseThrow(()->new MovieNotFoundException(id));
    }

}
