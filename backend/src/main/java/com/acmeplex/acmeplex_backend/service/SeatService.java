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

    public Map<String, Object> getSeatsByShowtime(Long showtimeId) {
        // Find the showtime by ID
        Optional<Showtime> optionalShowtime = showtimeRepository.findById(showtimeId);

        // Throw ShowtimeNotFoundException if the showtime is not found
        if (!optionalShowtime.isPresent()) {
            throw new ShowtimeNotFoundException(showtimeId);
        }

        Showtime showtime = optionalShowtime.get();

        // Map to store available and booked seats
        Map<String, Object> seatStatus = new HashMap<>();
        List<Seat> availableSeats = new ArrayList<>();
        List<Seat> bookedSeats = new ArrayList<>();
        List<Seat> seats = showtime.getSeats();
        // Loop through all the seats for the current showtime
        int total_seats = seats.size();
        long booked_seat = seats.stream().filter(Seat::isBooked).count();
        int allowedTicketCount =((int) (0.1 * total_seats)) - (int) booked_seat;

        double booked_percentage = (double) seats.stream().filter(Seat::isBooked).count() / seats.size();
        if (showtime.getMovie().isExclusive() && allowedTicketCount <= 0){
            for (Seat seat: seats){
                seat.setBooked(true);
                bookedSeats.add(seat);
            }
        } else {
            for (Seat seat : seats) {
                if (seat.isBooked()) {
                    bookedSeats.add(seat); // If seat is booked, add to booked list
                } else {
                    availableSeats.add(seat); // Otherwise, add to available list
                }
            }

        }
        seatStatus.put("available", availableSeats);
        seatStatus.put("booked", bookedSeats);
        seatStatus.put("allowedSeatCount", allowedTicketCount);
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
