package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Movie findByName(String announcement);
}
