package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;

    @Autowired
    public ShowtimeService(ShowtimeRepository showtimeRepository) {
        this.showtimeRepository = showtimeRepository;
    }

    public Map<String, Object> getShowtimesByMovieAndDate(Long movieId, String selectedDate) {
        // Parse the selected date string (e.g., "2024-11-18") to a LocalDate
        LocalDate date = LocalDate.parse(selectedDate);

        // Calculate the start and end of the selected date (from midnight to the end of the day)
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Fetch the showtimes for the given movie and date range
        List<Showtime> showtimes = showtimeRepository.findByMovieIdAndDateRange(movieId, startOfDay, endOfDay);

        // If no showtimes are found, return a response indicating so
        if (showtimes.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "No showtimes found for the selected date.");
            return response;
        }

        if (showtimes.isEmpty()) {
            return Collections.emptyMap(); // Return an empty response if no showtimes are found
        }

        // Assuming all showtimes share the same movie
        Movie movie = showtimes.get(0).getMovie();

        // Use LinkedHashMap to maintain insertion order
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", movie.getId());
        response.put("title", movie.getName());
        response.put("poster", movie.getPoster());
        response.put("duration", movie.getDuration());
        response.put("releaseDate", movie.getReleaseDate());
        response.put("genre", movie.getGenre());
        response.put("description", movie.getDescription());

        // Collect showtimes grouped by theatre
        Map<Long, Map<String, Object>> theatres = new LinkedHashMap<>();
        for (Showtime showtime : showtimes) {
            Theatre theatre = showtime.getTheatre();
            Map<String, Object> theatreData = theatres.computeIfAbsent(theatre.getId(), id -> {
                Map<String, Object> newTheatreData = new LinkedHashMap<>();
                newTheatreData.put("id", theatre.getId());
                newTheatreData.put("name", theatre.getName());
                newTheatreData.put("Address", theatre.getAddress());
                newTheatreData.put("showtimes", new ArrayList<>()); // Initialize showtimes list
                return newTheatreData;
            });

            List<Map<String, Object>> theatreShowtimes = (List<Map<String, Object>>) theatreData.get("showtimes");
            Map<String, Object> showtimeData = new LinkedHashMap<>();
            showtimeData.put("id", showtime.getId());
            showtimeData.put("startTime", showtime.getStartTime());
            theatreShowtimes.add(showtimeData);
        }

        response.put("theatres", theatres.values());
        return response;
    }


    public Map<String, Object> getShowtimesByTheatreAndDate(Long theatreId, String selectedDate) {
        // Parse the selected date string (e.g., "2024-11-18") to a LocalDate
        LocalDate date = LocalDate.parse(selectedDate);

        // Calculate the start and end of the selected date (from midnight to the end of the day)
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Fetch the showtimes for the given theatre and date range
        List<Showtime> showtimes = showtimeRepository.findByTheatreIdAndDateRange(theatreId, startOfDay, endOfDay);

        // If no showtimes are found, return a response indicating so
        if (showtimes.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "No showtimes found for the selected date.");
            return response;
        }

        if (showtimes.isEmpty()) {
            return new HashMap<>(); // Return an empty response if no showtimes are found
        }

        // Assuming all showtimes share the same theatre
        Theatre theatre = showtimes.get(0).getTheatre();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", theatre.getId());
        response.put("name", theatre.getName());
        response.put("address", theatre.getAddress());

        // Collect movies and their showtimes filtered by the selected date
        Map<Long, Map<String, Object>> movies = new LinkedHashMap<>();
        for (Showtime showtime : showtimes) {
            Movie movie = showtime.getMovie();

            Map<String, Object> movieData = movies.computeIfAbsent(movie.getId(), id -> {
                Map<String, Object> newMovieData = new LinkedHashMap<>();
                newMovieData.put("id", movie.getId());
                newMovieData.put("title", movie.getName());
                newMovieData.put("poster", movie.getPoster());
                newMovieData.put("duration", movie.getDuration());
                newMovieData.put("genre", movie.getGenre());
                newMovieData.put("showtimes", new ArrayList<>()); // Initialize showtimes list
                return newMovieData;
            });

            List<Map<String, Object>> movieShowtimes = (List<Map<String, Object>>) movieData.get("showtimes");
            Map<String, Object> showtimeData = new LinkedHashMap<>();
            showtimeData.put("id", showtime.getId());
            showtimeData.put("startTime", showtime.getStartTime());
            movieShowtimes.add(showtimeData);
        }

        // Add filtered movies to the response
        response.put("movies", movies.values());
        return response;
    }
}
