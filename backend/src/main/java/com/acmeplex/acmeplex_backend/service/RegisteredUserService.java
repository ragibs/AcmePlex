package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.ObserverPattern.Announcement;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class RegisteredUserService implements UserDetailsService {
    @Autowired
    private final RegisteredUserRepository registeredUserRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisteredUserService(RegisteredUserRepository registeredUserRepository, PasswordEncoder passwordEncoder) {
        this.registeredUserRepository = registeredUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    private Announcement announcementService;

    public void registerRegisteredUser(String email, String password, String name){
        RegisteredUser registeredUser = new RegisteredUser();
        registeredUser.setEmail(email);
        String encodedPassword = passwordEncoder.encode(password);
        registeredUser.setPassword(encodedPassword);
        registeredUser.setName(name);
        registeredUserRepository.save(registeredUser);

        announcementService.attach(registeredUser);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        RegisteredUser registeredUser = registeredUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with the following email: " + email));
        return org.springframework.security.core.userdetails.User.builder()
                .username(registeredUser.getEmail())
                .password(registeredUser.getPassword())
                .authorities(Collections.emptyList())
                .build();
    }
}
