package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/seats")
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class SeatController {
    private final SeatService seatService;

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }
}
