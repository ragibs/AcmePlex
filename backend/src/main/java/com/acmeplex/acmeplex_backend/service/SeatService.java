package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.exception.ShowtimeNotFoundException;
import com.acmeplex.acmeplex_backend.model.Seat;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.repository.SeatRepository;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SeatService {
    private final SeatRepository seatRepository;

    @Autowired
    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @Autowired
    private ShowtimeRepository showtimeRepository;

    public Map<String, List<Seat>> getSeatsByShowtime(Long showtimeId) {
        // Find the showtime by ID
        Optional<Showtime> optionalShowtime = showtimeRepository.findById(showtimeId);

        // Throw ShowtimeNotFoundException if the showtime is not found
        if (!optionalShowtime.isPresent()) {
            throw new ShowtimeNotFoundException(showtimeId);
        }

        Showtime showtime = optionalShowtime.get();

        // Map to store available and booked seats
        Map<String, List<Seat>> seatStatus = new HashMap<>();
        List<Seat> availableSeats = new ArrayList<>();
        List<Seat> bookedSeats = new ArrayList<>();
        List<Seat> seats = showtime.getSeats();
        // Loop through all the seats for the current showtime
        int total_seats = seats.size();
        long booked_seat = seats.stream().filter(Seat::isBooked).count();
        double booked_percentage = (double) seats.stream().filter(Seat::isBooked).count() / seats.size();
        if (showtime.getMovie().isExclusive() && booked_percentage >= 0.1){
            for (Seat seat: seats){
                seat.setBooked(true);
                bookedSeats.add(seat);
            }
        }
        for (Seat seat : seats) {
            if (seat.isBooked()) {
                bookedSeats.add(seat); // If seat is booked, add to booked list
            } else {
                availableSeats.add(seat); // Otherwise, add to available list
            }
        }

        seatStatus.put("available", availableSeats);
        seatStatus.put("booked", bookedSeats);
        return seatStatus;
    }

    public boolean checkSeatAvailability(List<Long> seatIDS){
        boolean seatsAvailable = true;
        for (Long seatID: seatIDS){
            Optional<Seat> seat = seatRepository.findById(seatID);
            if (seat.isEmpty()){
                throw new IllegalArgumentException("Invalid Seat ID provided");
            }
            if (seat.get().isBooked()){
                seatsAvailable = false;
            }
        }
        return seatsAvailable;
    }
}
