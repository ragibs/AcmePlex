package com.acmeplex.acmeplex_backend.exception;

public class TheatreNotFoundException extends RuntimeException {
    public TheatreNotFoundException(Long id) {
        super(
                "Couldn't find the theatre with id " + id
        );
    }
}
