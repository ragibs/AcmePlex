package com.acmeplex.acmeplex_backend.model;

import jakarta.persistence.Entity;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.lang.NonNull;

@Entity
public class RegisteredUser extends User {

    @NotNull
    private String address;
    @NotNull
    private String name;
//    @NonNull
//    private PaymentInfo paymentInfo;



    private String password;
    public String getPassword(){
        return password;
    }

    public void setPassword(String password){
        this.password=password;
    }
}
