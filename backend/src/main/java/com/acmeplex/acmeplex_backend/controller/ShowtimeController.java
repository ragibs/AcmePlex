package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.Seat;
import com.acmeplex.acmeplex_backend.service.SeatService;
import com.acmeplex.acmeplex_backend.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * The ShowtimeController handles operations related to showtimes and their associated seats.
 * This includes retrieving available and booked seats for a specific showtime and sending a response showing a count
 * of remaining available seats for the selected showtime.
 */
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class ShowtimeController {
    private final ShowtimeService showtimeService;

    @Autowired
    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @Autowired
    private SeatService seatService;

    /**
     * Retrieves available and booked seats for a specific showtime alongside a count of remaining available seats.
     *
     * @param showtimeId the ID of the showtime for which seats are being requested
     * @return a {@link ResponseEntity} containing a map with seat information
     */
    @GetMapping("/showtime/{showtimeId}/seats")
    public ResponseEntity<Map<String, Object>> getSeatsByShowtime(@PathVariable Long showtimeId) {
        Map<String, Object> seats = seatService.getSeatsByShowtime(showtimeId);
        return ResponseEntity.ok(seats);
    }
}
