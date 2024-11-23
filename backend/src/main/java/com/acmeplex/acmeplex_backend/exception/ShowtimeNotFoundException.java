package com.acmeplex.acmeplex_backend.exception;

public class ShowtimeNotFoundException extends RuntimeException {
    public ShowtimeNotFoundException(Long id) {
        super("Could not find seats for showtimes with id " + id);
    }
}