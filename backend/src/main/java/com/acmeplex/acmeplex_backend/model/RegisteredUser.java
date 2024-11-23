package com.acmeplex.acmeplex_backend.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
//@PrimaryKeyJoinColumn(name = "user_id")
public class RegisteredUser extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String password;

    private String email;

    @NotNull
    private String address;

    @NotNull
    private String name;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


}
