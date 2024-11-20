package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservationService{

    @Autowired
    private ReservationRepository reservationRepository;
}
