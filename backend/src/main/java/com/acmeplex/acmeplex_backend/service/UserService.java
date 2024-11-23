package com.acmeplex.acmeplex_backend.service;
import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void registerUser(String email){
        User user = new User();
        user.setEmail(email);
        userRepository.save(user);
    }
}