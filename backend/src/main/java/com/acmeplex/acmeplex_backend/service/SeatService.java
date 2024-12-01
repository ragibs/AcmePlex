package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.exception.ShowtimeNotFoundException;
import com.acmeplex.acmeplex_backend.model.Seat;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.repository.SeatRepository;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Service class for managing seats. Provides functionality to retrieve, check availability, and create seats.
 */
@Service
public class SeatService {
    private final SeatRepository seatRepository;

    @Autowired
    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @Autowired
    private ShowtimeRepository showtimeRepository;

    /**
     * Retrieves the seats for a specific showtime and categorizes them into available and booked seats.
     * Calculates the allowed ticket movie exclusivity status and booked seat count.
     *
     * @param showtimeId The ID of the showtime for which seats are being requested.
     * @return A map containing the available seats, booked seats, and allowed bookable seat count for the showtime.
     * @throws ShowtimeNotFoundException if no showtime is found with the provided ID.
     */
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
        int allowedTicketCount;
        if (showtime.getMovie().isExclusive()){
            allowedTicketCount = ((int) (0.1 * total_seats)) - (int) booked_seat;
        } else {
            allowedTicketCount = total_seats - (int) booked_seat;
        }


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

    /**
     * Checks if the given list of seats are available.
     *
     * @param seatIDS A list of seat IDs to be checked for availability.
     * @return True if all the seats are available, false if any seat is booked.
     * @throws IllegalArgumentException if any seat ID is invalid.
     */
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

    /**
     * Creates a specified number of seats for a given showtime.
     * The seats are initially marked as available and are assigned seat numbers in a row format.
     *
     * @param showtime The showtime for which seats are being created.
     * @param seatCount The total number of seats to be created.
     */
    public void createSeatsForShowtime(Showtime showtime, int seatCount) {
        int seatsPerRow = 10; // Number of seats per row
        char currentRow = 'A'; // Starting row letter


        for (int i = 1; i <= seatCount; i++) {
            // Generate seat number in the format "A1", "A2", ..., "B1", etc.
            String seatNumber = currentRow + String.valueOf((i - 1) % seatsPerRow + 1);


            Seat seat = new Seat();
            seat.setSeatNumber(seatNumber);
            seat.setBooked(false); // Initially all seats are available
            seat.setShowtime(showtime);


            seatRepository.save(seat);


            // Move to the next row after seatsPerRow
            if (i % seatsPerRow == 0) {
                currentRow++;
            }
        }
    }

}
