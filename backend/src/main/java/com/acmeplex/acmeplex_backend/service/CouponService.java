package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.Coupon;
import com.acmeplex.acmeplex_backend.model.CouponStatus;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.CouponRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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

    public double redeemCoupon(String userEmail, String couponCode){
        return 2;
//        Need to Implement custom query in repo
    }


}
