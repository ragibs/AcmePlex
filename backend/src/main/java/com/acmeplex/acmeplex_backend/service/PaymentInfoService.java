package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.PaymentInfo;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.PaymentInfoRepository;
import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentInfoService {
    @Autowired
    private final PaymentInfoRepository paymentInfoRepository;
    @Autowired
    private RegisteredUserRepository registeredUserRepository;

    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }



    public PaymentInfo createPayment(PaymentInfo payment) {
        PaymentInfo pi = new PaymentInfo();

//        Optional<User> user = userRepository.findById(payment.getUser().getId());

//        Optional<User> registeredUser = registeredUserRepository.findById(payment.getUserID());
        pi.setCardHolder(payment.getCardHolder());
        pi.setCvv(payment.getCvv());
        pi.setCardNumber(payment.getCardNumber());
        pi.setExpiryDate(payment.getExpiryDate());

        pi.setUser(payment.getUser());

        return paymentInfoRepository.save(pi);
    }

    public Optional<PaymentInfo> getPaymentByUserId(Long userId) {
        return paymentInfoRepository.findByUserId(userId);

    }

}
