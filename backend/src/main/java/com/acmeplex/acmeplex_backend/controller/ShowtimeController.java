package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.Seat;
import com.acmeplex.acmeplex_backend.service.SeatService;
import com.acmeplex.acmeplex_backend.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
public class ShowtimeController {
    private final ShowtimeService showtimeService;

    @Autowired
    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @Autowired
    private SeatService seatService;

    // Endpoint to get available and booked seats for a specific showtime
    @GetMapping("/showtime/{showtimeId}/seats")
    public ResponseEntity<Map<String, List<Seat>>> getSeatsByShowtime(@PathVariable Long showtimeId) {
        Map<String, List<Seat>> seats = seatService.getSeatsByShowtime(showtimeId);
        return ResponseEntity.ok(seats);
    }
}
