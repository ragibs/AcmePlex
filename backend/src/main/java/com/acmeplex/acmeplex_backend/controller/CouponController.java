package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.CouponInformation;
import com.acmeplex.acmeplex_backend.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/coupon")
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class CouponController {
    @Autowired
    private CouponService couponService;

    @GetMapping("/get/{email}/{couponCode}")
    public ResponseEntity<?> getCoupon(@PathVariable String email, @PathVariable String couponCode){
        try{
            CouponInformation couponInformation = couponService.getCoupon(email, couponCode);
            return new ResponseEntity<>(couponInformation, HttpStatus.OK);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PutMapping("/redeem")
    public ResponseEntity<?> redeemCoupon(@RequestBody Map<String, Object> request){
        if (!(request.containsKey("email") && request.containsKey("couponCode") && request.containsKey("couponValue"))){
            return new ResponseEntity<>("Invalid request paramaters", HttpStatus.BAD_REQUEST);
        }
        String email = (String) request.get("email");
        String couponCode = (String) request.get("couponCode");
        Number couponValueNumber = (Number) request.get("couponValue");
        double couponValue = couponValueNumber.doubleValue();
        try{
            couponService.redeemCoupon(email, couponCode, couponValue);
            return new ResponseEntity<>("Coupon Redeemed Successfully", HttpStatus.ACCEPTED);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
