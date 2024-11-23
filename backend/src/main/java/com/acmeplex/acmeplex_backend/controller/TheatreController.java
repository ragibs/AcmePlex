package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.service.ShowtimeService;
import com.acmeplex.acmeplex_backend.service.TheatreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
public class TheatreController {

    @Autowired
    private TheatreService theatreService;

    @Autowired
    private ShowtimeService showtimeService;

    @GetMapping("/theatres")
    public List<Theatre> getAllTheatre(){
        return theatreService.getAllTheatre();
    }

    @GetMapping("/theatre/{id}")
    public ResponseEntity<Theatre> getTheatreById(@PathVariable Long id){
        Theatre theatre = theatreService.getTheatreById(id);
        return ResponseEntity.ok(theatre);
    }

    @GetMapping("theatre/{theatreId}/showtimes")
    public List<Map<String, Object>> getShowtimesForTheatre(@PathVariable Long theatreId) {
        return showtimeService.getShowtimesByTheatre(theatreId);
    }
}
