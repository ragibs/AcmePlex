package com.acmeplex.acmeplex_backend.model;

import jakarta.persistence.Entity;

@Entity
public class RegisteredUser extends User {
    private String password;
    public String getPassword(){
        return password;
    }

    public void setPassword(String password){
        this.password=password;
    }
}
