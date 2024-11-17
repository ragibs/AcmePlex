package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.exception.TheatreNotFoundException;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public class TheatreService {

    @Autowired
    private TheatreRepository theatreRepository;

    public List<Theatre> getAllTheatre(){
        return theatreRepository.findAll();
    }


    public Theatre getTheatreById(@PathVariable Long id){
        return theatreRepository.findById(id)
                .orElseThrow(()-> new TheatreNotFoundException(id));
    }
}
