package com.acmeplex.acmeplex_backend.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
//@PrimaryKeyJoinColumn(name = "user_id")
public class RegisteredUser extends User {

    private String password;

    private String email;

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
