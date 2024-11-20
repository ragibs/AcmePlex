package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
