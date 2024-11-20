package com.acmeplex.acmeplex_backend.model;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;
    private String role;

    @Column(unique = true)
    public String getUsername(){
        return username;
    }
    public String getEmail(){
        return email;
    }
    public String getPassword(){
        return password;
    }
    public String getRole(){
        return role;
    }

    public void setUsername(String name){
        username= name;
    }
    public void setEmail(String email){
        this.email= email;
    }
    public void setPassword(String password){
        this.password= password;
    }
    public void setRole(String role){
        this.role= role;
    }
}
