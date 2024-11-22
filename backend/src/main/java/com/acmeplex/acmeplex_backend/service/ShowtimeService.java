package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.Showtime;
import com.acmeplex.acmeplex_backend.model.Theatre;
import com.acmeplex.acmeplex_backend.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;

    @Autowired
    public ShowtimeService(ShowtimeRepository showtimeRepository) {
        this.showtimeRepository = showtimeRepository;
    }

    public List<Map<String, Object>> getShowtimesForMovie(Long movieId) {
        List<Showtime> showtimes = showtimeRepository.findByMovieId(movieId);

        List<Map<String, Object>> response = new ArrayList<>();
        for (Showtime showtime : showtimes) {
            Map<String, Object> showtimeData = new HashMap<>();
            showtimeData.put("id", showtime.getId());
            showtimeData.put("startTime", showtime.getStartTime());

            Map<String, Object> theatreData = new HashMap<>();
            Theatre theatre = showtime.getTheatre();
            theatreData.put("id", theatre.getId());
            theatreData.put("name", theatre.getName());
            theatreData.put("Address", theatre.getAddress());

            showtimeData.put("theatre", theatreData);

            response.add(showtimeData);
        }
        return response;
    }
}
