package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.PaymentInfo;
import com.acmeplex.acmeplex_backend.service.PaymentInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
@RequestMapping("/payment")
public class PaymentInfoController {
    private final PaymentInfoService paymentInfoService;

    public PaymentInfoController(PaymentInfoService paymentInfoService) {
        this.paymentInfoService = paymentInfoService;
    }

    @PostMapping("/save")
    public ResponseEntity<String> createPayment(@RequestBody PaymentInfo paymentInfo) {
        Optional<PaymentInfo> oldPaymentMethod = paymentInfoService.getPaymentByEmail(
                paymentInfo.getRegisteredUser().getEmail());
        if (oldPaymentMethod.isPresent()){
            return ResponseEntity.status(409).body("This user already has payment information please use the update endpoint");
        }
        PaymentInfo savedPayment = paymentInfoService.createPayment(paymentInfo);
        return ResponseEntity.status(200).body("Payment information saved sucessfully");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updatePayment(@RequestBody PaymentInfo paymentInfo){
        Optional<PaymentInfo> oldPaymentMethod = paymentInfoService.getPaymentByEmail(
                paymentInfo.getRegisteredUser().getEmail());
        if (oldPaymentMethod.isEmpty()){
            return ResponseEntity.status(404).body("This user does not currently have a payment method");
        }

        paymentInfoService.updatePayment(oldPaymentMethod.get(), paymentInfo);
        return ResponseEntity.status(200).body("Payment information updated sucessfully");
    }

    @GetMapping("/{email}")
    public ResponseEntity<Map<String, String>> getPaymentInfo(@PathVariable String email) {
        Optional<PaymentInfo> payment = paymentInfoService.getPaymentByEmail(email);
        if (payment.isPresent()) {
            Map<String, String> paymentInfoJSON = new HashMap<>();
            paymentInfoJSON.put("cardNumber", payment.get().getCardNumber());
            paymentInfoJSON.put("cardHolder", payment.get().getCardHolder());
            paymentInfoJSON.put("expiryDate", payment.get().getExpiryDate());
            paymentInfoJSON.put("cvv", payment.get().getCvv());
            return ResponseEntity.status(200).body(paymentInfoJSON);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }
}
