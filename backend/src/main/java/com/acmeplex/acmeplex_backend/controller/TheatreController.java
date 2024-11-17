package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class TheatreController {

    @Autowired
    private TheatreRepository theatreRepository;

    @GetMapping("/theatres")
    public List<Theatre> getAllTheatre(){
        return theatreRepository.findAll();
    }

}
