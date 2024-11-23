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

@Service
public class PaymentInfoService {
    @Autowired
    private final PaymentInfoRepository paymentInfoRepository;
    @Autowired
    private RegisteredUserRepository registeredUserRepository;

    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }



//    public PaymentInfo createPayment(PaymentInfo paymentInfo) {
//        PaymentInfo paymentObject = new PaymentInfo();
//
////        Optional<User> user = userRepository.findById(payment.getUser().getId());
//
////        Optional<User> registeredUser = registeredUserRepository.findById(payment.getUserID());
//        paymentObject.setCardHolder(paymentInfo.getCardHolder());
//        paymentObject.setCvv(paymentInfo.getCvv());
//        paymentObject.setCardNumber(paymentInfo.getCardNumber());
//        paymentObject.setExpiryDate(paymentInfo.getExpiryDate());
//
//        paymentObject.setRegisteredUser(paymentInfo.getRegisteredUser());
//
//        return paymentInfoRepository.save(paymentObject);
//    }

    public PaymentInfo createPayment(PaymentInfo paymentInfo) {
        String email = paymentInfo.getRegisteredUser().getEmail();
        RegisteredUser registeredUser = registeredUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("There is no registered user with that email address"));
        paymentInfo.setRegisteredUser(registeredUser);
        return paymentInfoRepository.save(paymentInfo);
    }

    public void updatePayment(PaymentInfo oldPayment, PaymentInfo newPayment){
        oldPayment.setCardNumber(newPayment.getCardNumber());
        oldPayment.setCardHolder(newPayment.getCardHolder());
        oldPayment.setExpiryDate(newPayment.getExpiryDate());
        oldPayment.setCvv(newPayment.getCvv());
        paymentInfoRepository.save(oldPayment);
    }

    public Optional<PaymentInfo> getPaymentByEmail(String email) {
        return paymentInfoRepository.findByRegisteredUser_Email(email);

    }

}
