package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCouponCode(String couponCode);
}
