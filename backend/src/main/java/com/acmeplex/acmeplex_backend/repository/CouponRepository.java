package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
}
