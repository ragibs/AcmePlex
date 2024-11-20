package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("http://localhost:3000")
public class TicketController
{
    @Autowired
    private TicketService ticketService;
}
