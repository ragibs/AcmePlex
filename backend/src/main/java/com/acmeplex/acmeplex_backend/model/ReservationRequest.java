package com.acmeplex.acmeplex_backend.model;

import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public record ReservationRequest(Long showtimeID, List<Long> seatIDList, String userEmail, String paymentConfirmation, double reservationValue) {
}
