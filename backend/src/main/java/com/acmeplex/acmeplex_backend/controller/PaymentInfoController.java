package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.model.PaymentInfo;
import com.acmeplex.acmeplex_backend.service.PaymentInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * The PaymentInfoController handles REST API endpoints for managing user payment information.
 *
 * This controller provides functionality for creating, updating, and retrieving payment information
 * associated with registered users.
 */
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://acme-plex.vercel.app/"})
@RequestMapping("/payment")
public class PaymentInfoController {
    private final PaymentInfoService paymentInfoService;

    public PaymentInfoController(PaymentInfoService paymentInfoService) {
        this.paymentInfoService = paymentInfoService;
    }

    /**
     * Saves new payment information for a registered user.
     * If the user already has payment information, the request is rejected with a
     * {@code 409 Conflict} status. Otherwise, the payment information is saved successfully.
     *
     * @param paymentInfo the {@link PaymentInfo} object containing payment details
     * @return a {@link ResponseEntity} with a success or error message
     */
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

    /**
     * Updates existing payment information for a registered user.
     * If the user does not have existing payment information, the request is rejected
     * with a {@code 404 Not Found} status. Otherwise, the payment information is updated successfully.</p>
     *
     * @param paymentInfo the {@link PaymentInfo} object containing updated payment details
     * @return a {@link ResponseEntity} with a success or error message
     */
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

    /**
     * Retrieves payment information for a specific registered user by email.
     * If payment information is found, it returns the card details: card number, cardholder name,
     * expiry date and CVV. If not found, a {@code 404 Not Found} response is returned.
     *
     * @param email the email of the registered user whose payment information is to be retrieved
     * @return a {@link ResponseEntity} containing the payment information as a map or a {@code 404 Not Found} if not found
     */
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
