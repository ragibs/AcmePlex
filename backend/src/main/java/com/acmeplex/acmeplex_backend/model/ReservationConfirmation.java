package com.acmeplex.acmeplex_backend.model;

import java.time.LocalDateTime;
import java.util.List;

public class ReservationConfirmation {

//    public ReservationConfirmation(String movieName, String moviePoster, String theatreName, LocalDateTime showTime, String userEmail, List<String> seatNames){
//        this.movieName= movieName;
//        this.moviePoster = moviePoster;
//        this.theatreName = theatreName;
//        this.showTime = showTime;
//        this.userEmail = userEmail;
//        this.seatNames = seatNames;
//    }
    private String movieName;

    private String moviePoster;

    private String theatreName;

    private LocalDateTime showTime;

    private String userEmail;

    private List<String> seatNames;

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
