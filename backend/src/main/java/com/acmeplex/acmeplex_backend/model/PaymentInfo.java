package com.acmeplex.acmeplex_backend.model;

import jakarta.persistence.*;

@Entity
public class PaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;
    @Column(name = "cardNumber", nullable = true)
    private String cardNumber;
    @Column(name = "CVV", nullable = true)
    private String cvv;
    @Column(name = "expiryDate", nullable = true)
    private String expiryDate;

    @Column(name = "cardHolder", nullable = true)
    private String cardHolder;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    public Long getID() {
        return ID;
    }

    public void setID(Long ID) {
        this.ID = ID;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCardHolder() {
        return cardHolder;
    }

    public void setCardHolder(String cardHolder) {
        this.cardHolder = cardHolder;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

//    public Long getUserID(){
//        return user.getId();
//    }
}
