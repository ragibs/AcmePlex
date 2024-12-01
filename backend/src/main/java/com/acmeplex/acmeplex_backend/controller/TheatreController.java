package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.service.ShowtimeService;
import com.acmeplex.acmeplex_backend.service.TheatreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * The TheatreController handles operations related to theatres.
 * This includes retrieving all theatres, fetching details for a specific theatre,
 * and obtaining showtimes for a theatre on a particular date.
 */
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class TheatreController {

    @Autowired
    private TheatreService theatreService;

    @Autowired
    private ShowtimeService showtimeService;

    /**
     * Retrieves a list of all theatres.
     *
     * @return a list of all {@link Theatre} objects
     */
    @GetMapping("/theatres")
    public List<Theatre> getAllTheatre(){
        return theatreService.getAllTheatre();
    }

    /**
     * Retrieves details of a specific theatre by its ID.
     *
     * @param id the ID of the theatre to retrieve
     * @return a {@link ResponseEntity} containing the {@link Theatre} object
     */
    @GetMapping("/theatre/{id}")
    public ResponseEntity<Theatre> getTheatreById(@PathVariable Long id){
        Theatre theatre = theatreService.getTheatreById(id);
        return ResponseEntity.ok(theatre);
    }

    /**
     * Retrieves showtimes for a specific theatre on a selected date.
     *
     * @param theatreId the ID of the theatre
     * @param selectedDate the selected date for which showtimes are requested
     * @return a map containing the showtime details.
     */
    @GetMapping("theatre/{theatreId}/showtimes")
    public Map<String, Object> getShowtimesForTheatre(
            @PathVariable Long theatreId,
            @RequestParam String selectedDate) { // Accept the selected date as a query parameter
        return showtimeService.getShowtimesByTheatreAndDate(theatreId, selectedDate); // Pass date to service
    }
}
