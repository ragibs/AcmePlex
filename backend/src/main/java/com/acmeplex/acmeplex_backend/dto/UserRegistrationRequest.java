package com.acmeplex.acmeplex_backend.dto;

import com.acmeplex.acmeplex_backend.model.PaymentInfo;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;

//user registration DTO to register a payment with payment info

public class UserRegistrationRequest {
    private RegisteredUser registeredUser;
    private PaymentInfo paymentInfo;

    public RegisteredUser getRegisteredUser() {
        return registeredUser;
    }

    public void setRegisteredUser(RegisteredUser registeredUser) {
        this.registeredUser = registeredUser;
    }

    public PaymentInfo getPaymentInfo() {
        return paymentInfo;
    }

    public void setPaymentInfo(PaymentInfo paymentInfo) {
        this.paymentInfo = paymentInfo;
    }
}