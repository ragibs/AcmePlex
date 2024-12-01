package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.Movie;
import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.MovieRepository;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class responsible for managing and retrieving showtimes for movies in theatres.
 * Provides functionality to get showtimes based on movie or theatre for a selected date.
 */
@Service
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;

    @Autowired
    public ShowtimeService(ShowtimeRepository showtimeRepository) {
        this.showtimeRepository = showtimeRepository;
    }
    @Autowired
    private MovieRepository movieRepository;

    /**
     * Retrieves the showtimes for a specific movie on a selected date.
     *
     * @param movieId The ID of the movie for which showtimes are being requested.
     * @param selectedDate The selected date for which showtimes are being requested in the format "YYYY-MM-DD".
     * @return A map containing movie details and showtimes for each theatre on the selected date.
     * @throws IllegalArgumentException if the movie ID is invalid or the movie does not exist.
     */
    public Map<String, Object> getShowtimesByMovieAndDate(Long movieId, String selectedDate) {
        // Parse the selected date string (e.g., "2024-11-18") to a LocalDate
        LocalDate date = LocalDate.parse(selectedDate);
        // Calculate the start and end of the selected date (from midnight to the end of the day)
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        Optional<Movie> movieOptional = movieRepository.findById(movieId);
        if (movieOptional.isEmpty()){
            throw new IllegalArgumentException("Invalid Movie ID");
        }
        if (movieOptional.get().isExclusive()){
            List<LocalDateTime> startAndEndTime = movieStartAndEnd(movieOptional.get());
            startOfDay = startAndEndTime.get(0);
            endOfDay = startAndEndTime.get(1);
        }


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

    /**
     * Retrieves the showtimes for a specific theatre on a selected date.
     *
     * @param theatreId The ID of the theatre for which showtimes are being requested.
     * @param selectedDate The selected date for which showtimes are being requested in the format "YYYY-MM-DD".
     * @return A map containing theatre details and a list of movies with their showtimes for the selected date.
     */
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

    /**
     * Calculates the start and end time for an exclusive movie based on its showtime.
     *
     * @param movie The movie whose start and end times need to be calculated.
     * @return A list containing the start and end time of the exclusive movie.
     */
    public List<LocalDateTime> movieStartAndEnd(Movie movie){
            List<Showtime> showtimes = movie.getShowtimes();
            LocalDate date = showtimes.get(0).getStartTime().toLocalDate();
            List<LocalDateTime> dateList = new ArrayList<>();
            dateList.add(date.atStartOfDay());
            dateList.add(date.atTime(LocalTime.MAX));
            return dateList;
    }

    /**
     * Retrieves a specific showtime by its ID.
     *
     * @param showtimeId The ID of the showtime to be retrieved.
     * @return The showtime corresponding to the given ID.
     * @throws IllegalArgumentException if the showtime with the given ID does not exist.
     */
    public Showtime getShowtimeById(Long showtimeId) {
        return showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new IllegalArgumentException("Showtime with ID " + showtimeId + " not found"));
    }
}
