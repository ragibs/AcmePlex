package com.acmeplex.acmeplex_backend.model;

import com.acmeplex.acmeplex_backend.service.EmailService;
import com.acmeplex.acmeplex_backend.service.MovieService;
import com.fasterxml.jackson.annotation.JsonTypeName;
import jakarta.mail.MessagingException;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.beans.factory.annotation.Autowired;

@Entity
//@PrimaryKeyJoinColumn(name = "user_id")
public class RegisteredUser extends User {

    private String password;

//    private String email;

    @NotNull
    private String name;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void update(String announcement) {
        System.out.println("Received update: " + announcement);
    }

}
