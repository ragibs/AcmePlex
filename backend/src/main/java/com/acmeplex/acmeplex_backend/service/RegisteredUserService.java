package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.ObserverPattern.Announcement;
import com.acmeplex.acmeplex_backend.model.PaymentInfo;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.repository.PaymentInfoRepository;
import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

/**
 * Service class responsible for managing registered users, including registration, password encoding,
 * and user details retrieval for authentication purposes.
 */
@Service
public class RegisteredUserService implements UserDetailsService {
    @Autowired
    private final RegisteredUserRepository registeredUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final PaymentInfoRepository paymentInfoRepository;

    @Autowired
    private Announcement announcementService;

    public RegisteredUserService(RegisteredUserRepository registeredUserRepository, PasswordEncoder passwordEncoder, PaymentInfoRepository paymentInfoRepository) {
        this.registeredUserRepository = registeredUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.paymentInfoRepository = paymentInfoRepository;

    }

    /**
     * Registers a new registered user and their payment information.
     * The user's password is encoded before saving. After the user is created, their payment information
     * is associated with the user, and the user is attached to an announcement service.
     *
     * @param email the email address of the user to register
     * @param password the password for the user which is encoded before being persisted in the database
     * @param name the name of the registered user
     * @param paymentInfo the payment information associated with the user
     */
    public void registerRegisteredUser(String email, String password, String name, PaymentInfo paymentInfo){
        RegisteredUser registeredUser = new RegisteredUser();
        registeredUser.setEmail(email);
        String encodedPassword = passwordEncoder.encode(password);
        registeredUser.setPassword(encodedPassword);
        registeredUser.setName(name);
        RegisteredUser savedUser = registeredUserRepository.save(registeredUser);
        paymentInfo.setRegisteredUser(savedUser);
        paymentInfoRepository.save(paymentInfo);

        announcementService.attach(registeredUser);
    }

    /**
     * Loads a registered user by email for authentication.
     * This method is used by Spring Security to authenticate the user.
     *
     * @param email the email of the user to load
     * @return a UserDetails object for the given user
     * @throws UsernameNotFoundException if no user is found with the given email
     */
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
