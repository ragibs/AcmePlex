package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.Coupon;
import com.acmeplex.acmeplex_backend.model.CouponInformation;
import com.acmeplex.acmeplex_backend.model.CouponStatus;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.CouponRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

/**
 * The CouponService class provides functionality to create, validate, and redeem coupons.
 * Coupons are issued to users upon reservation cancellation and can be redeemed for discounts on purchases.
 * This service manages coupon creation, status checks, and the redemption process,
 * ensuring coupons are valid and not expired.
 */
@Service
public class CouponService {
    @Autowired
    private CouponRepository couponRepository;

    public String createCoupon(User user, double couponValue){
        String couponCode = RandomStringUtils.randomAlphabetic(6).toUpperCase();
        Coupon coupon = new Coupon();
        coupon.setUser(user);
        coupon.setCouponValue(couponValue);
        coupon.setCouponCode(couponCode);
        coupon.setCouponStatus(CouponStatus.active);
        coupon.setIssueDate(LocalDateTime.now());
        couponRepository.save(coupon);
        return couponCode;
    }

    /**
     * Retrieves the details of a coupon, including its status and value.
     * The coupon must belong to the user identified by the provided email.
     *
     * @param email the email of the user associated with the couponCode
     * @param couponCode the coupon code to look up
     * @return the coupon information (status and value)
     * @throws IllegalArgumentException if the coupon code is invalid or does not belong to the specified user
     */
    public CouponInformation getCoupon(String email, String couponCode){
        Optional<Coupon> couponOptional = couponRepository.findByCouponCode(couponCode);
        if (couponOptional.isEmpty()){
            throw new IllegalArgumentException("Invalid Coupon Code");
        }
        Coupon coupon = couponOptional.get();
        if (!coupon.getUser().getEmail().equals(email)){
            throw new IllegalArgumentException("This coupon code does not belong to the given email address: " + email);
        }
        return new CouponInformation(coupon.getCouponStatus(), coupon.getCouponValue());
    }

    /**
     * Redeems a coupon for a user by updating the coupon's value and status.
     * The coupon must be valid in order to redeem.
     *
     * @param email the email of the user associated with the couponCode
     * @param couponCode the coupon code to redeem
     * @param couponValue the value to redeem from the coupon
     * @throws IllegalArgumentException if the coupon is invalid, expired, or already used
     */
    public void redeemCoupon(String email, String couponCode, double couponValue){
        Coupon coupon = returnIfValid(email, couponCode);

        if (coupon.getCouponStatus() == CouponStatus.used || coupon.getCouponStatus() == CouponStatus.expired){
            throw new IllegalArgumentException("This coupon is not valid");
        }

        double daysFromCreation = Duration.between(LocalDateTime.now(), coupon.getIssueDate()).toDays();
        if (daysFromCreation >= 365){
            coupon.setCouponStatus(CouponStatus.expired);
            couponRepository.save(coupon);
            throw new IllegalArgumentException("This coupon has expired and is no longer valid");
        }

        if (couponValue <= 0){
            coupon.setCouponStatus(CouponStatus.used);
        }
        coupon.setCouponValue(couponValue);
        couponRepository.save(coupon);
    }

    /**
     * Validates a coupon by checking if it exists and belongs to the user identified by the provided email.
     *
     * @param email the email of the user associated with the couponCode
     * @param couponCode the coupon code to validate
     * @return the valid coupon if found
     * @throws IllegalArgumentException if the coupon is invalid or does not belong to the specified user
     */
    public Coupon returnIfValid(String email, String couponCode){
        Optional<Coupon> couponOptional = couponRepository.findByCouponCode(couponCode);
        if (couponOptional.isEmpty()){
            throw new IllegalArgumentException("Invalid Coupon Code");
        }
        Coupon coupon = couponOptional.get();
        if (!coupon.getUser().getEmail().equals(email)){
            throw new IllegalArgumentException("This coupon code does not belong to the given email address: " + email);
        }
        return coupon;
    }


}
