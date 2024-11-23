package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegisteredUserRepository extends JpaRepository<RegisteredUser, Long>{
    Optional<RegisteredUser> findByEmail(String email);
}