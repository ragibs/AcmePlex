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
