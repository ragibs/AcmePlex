package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.PaymentInfo;
import com.acmeplex.acmeplex_backend.service.PaymentInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/payments")
public class PaymentInfoController {
    private final PaymentInfoService paymentInfoService;

    public PaymentInfoController(PaymentInfoService paymentInfoService) {
        this.paymentInfoService = paymentInfoService;
    }

    @PostMapping
    public ResponseEntity<PaymentInfo> createPayment(@RequestBody PaymentInfo paymentInfo) {
        PaymentInfo savedPayment = paymentInfoService.createPayment(paymentInfo);
        return ResponseEntity.ok(savedPayment);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PaymentInfo> getPaymentByUserId(@PathVariable Long userId) {
        Optional<PaymentInfo> payment = paymentInfoService.getPaymentByUserId(userId);

        if (payment.isPresent()) {
            return ResponseEntity.ok(payment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
