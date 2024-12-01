package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.exception.TheatreNotFoundException;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Service class responsible for managing and retrieving theatre data.
 * Provides functionality to get all theatres and retrieve a specific theatre by its ID.
 */
@Service
public class TheatreService {

    @Autowired
    private TheatreRepository theatreRepository;

    /**
     * Retrieves all theatres from the database.
     *
     * @return A list of all theatres.
     */
    public List<Theatre> getAllTheatre(){
        return theatreRepository.findAll();
    }

    /**
     * Retrieves a specific theatre by its ID.
     *
     * @param id The ID of the theatre to be retrieved.
     * @return The theatre corresponding to the given ID.
     * @throws TheatreNotFoundException if no theatre with the given ID exists.
     */
    public Theatre getTheatreById(@PathVariable Long id){
        return theatreRepository.findById(id)
                .orElseThrow(()-> new TheatreNotFoundException(id));
    }
}
