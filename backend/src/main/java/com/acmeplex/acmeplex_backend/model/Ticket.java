package com.acmeplex.acmeplex_backend.model;

import jakarta.persistence.*;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double price;
    // Many-to-One relationship with Showtime
    @ManyToOne
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    // One-to-One relationship with Seat
    @OneToOne
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
}
