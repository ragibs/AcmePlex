package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.PaymentInfo;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.PaymentInfoRepository;
import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service class responsible for managing payment information related to registered users.
 */
@Service
public class PaymentInfoService {
    @Autowired
    private final PaymentInfoRepository paymentInfoRepository;
    @Autowired
    private RegisteredUserRepository registeredUserRepository;

    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    /**
     * Creates a new payment information record for a registered user.
     * The registered user must already exist in the system, identified by email.
     *
     * @param paymentInfo the payment information to be saved
     * @return the saved payment information
     * @throws IllegalArgumentException if no registered user exists with the provided email
     */
    public PaymentInfo createPayment(PaymentInfo paymentInfo) {
        String email = paymentInfo.getRegisteredUser().getEmail();
        RegisteredUser registeredUser = registeredUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("There is no registered user with that email address"));
        paymentInfo.setRegisteredUser(registeredUser);
        return paymentInfoRepository.save(paymentInfo);
    }

    /**
     * Updates an existing payment information record with new details.
     *
     * @param oldPayment the existing payment information to be updated
     * @param newPayment the new payment information that will replace the old details
     */
    public void updatePayment(PaymentInfo oldPayment, PaymentInfo newPayment){
        oldPayment.setCardNumber(newPayment.getCardNumber());
        oldPayment.setCardHolder(newPayment.getCardHolder());
        oldPayment.setExpiryDate(newPayment.getExpiryDate());
        oldPayment.setCvv(newPayment.getCvv());
        paymentInfoRepository.save(oldPayment);
    }

    /**
     * Retrieves the payment information for a registered user by email.
     *
     * @param email the email of the registered user whose payment information is to be retrieved
     * @return an Optional containing the payment information, or empty if no payment info is found
     */
    public Optional<PaymentInfo> getPaymentByEmail(String email) {
        return paymentInfoRepository.findByRegisteredUser_Email(email);

    }

}
