package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.CouponInformation;
import com.acmeplex.acmeplex_backend.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * The CouponController handles REST API endpoints related to coupon management.
 * This controller provides endpoints for retrieving and redeeming coupons.
 */
@RestController
@RequestMapping("/coupon")
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
public class CouponController {
    @Autowired
    private CouponService couponService;

    /**
     * Retrieves the status and value of a specific coupon for a given email and coupon code after ensuring the coupon code belongs to the given email.
     *
     * @param email the email associated with the coupon
     * @param couponCode the code of the coupon to retrieve
     * @return a {@link ResponseEntity} containing {@link CouponInformation} if successful,
     *         or an error message with a {@link HttpStatus#BAD_REQUEST} if the input is invalid
     */
    @GetMapping("/get/{email}/{couponCode}")
    public ResponseEntity<?> getCoupon(@PathVariable String email, @PathVariable String couponCode){
        try{
            CouponInformation couponInformation = couponService.getCoupon(email, couponCode);
            return new ResponseEntity<>(couponInformation, HttpStatus.OK);
        } catch (IllegalArgumentException exception){
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * Redeems a coupon for a given email, coupon code, and coupon value.
     *
     * This endpoint processes a coupon redemption request. It expects a JSON payload
     * with `email`, `couponCode`, and `couponValue` keys. On successful redemption the existing coupon value is updated with the given value.
     *
     * @param request a map containing the request parameters: `email`, `couponCode`, and `couponValue`
     * @return a {@link ResponseEntity} with a success or error message
     */
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
