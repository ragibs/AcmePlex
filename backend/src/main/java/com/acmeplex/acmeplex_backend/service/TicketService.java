package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;
}
