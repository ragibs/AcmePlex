package com.acmeplex.acmeplex_backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ReservationConfirmation {

    private String movieName;

    private String moviePoster;

    private String theatreName;

    private LocalDateTime showTime;

    private String userEmail;

    private List<String> seatNames = new ArrayList<>();

    public String getMovieName() {
        return movieName;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public String getMoviePoster() {
        return moviePoster;
    }

    public void setMoviePoster(String moviePoster) {
        this.moviePoster = moviePoster;
    }

    public String getTheatreName() {
        return theatreName;
    }

    public void setTheatreName(String theatreName) {
        this.theatreName = theatreName;
    }

    public LocalDateTime getShowTime() {
        return showTime;
    }

    public void setShowTime(LocalDateTime showTime) {
        this.showTime = showTime;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<String> getSeatName() {
        return seatNames;
    }

    public void setSeatName(List<String> seatNames) {
        this.seatNames = seatNames;
    }

    public void addSeatName(String seatName){
        seatNames.add(seatName);
    }
}
