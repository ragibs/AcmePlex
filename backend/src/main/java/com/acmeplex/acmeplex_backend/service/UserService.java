package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.User;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(String email, String password){
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);

        return userRepository.save(user);
    }

    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()){
            User user = userOpt.get();
            if (password.matches(user.getPassword()));
            {
                return "Successfully logged in"; //would be where we return the jwt token?
            }
        }
        throw new RuntimeException("Invalid Email or Password");
    }
}
