package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
