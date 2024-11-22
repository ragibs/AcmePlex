package com.acmeplex.acmeplex_backend.service;

import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
import com.acmeplex.acmeplex_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RegisteredUserService {
    @Autowired
    private RegisteredUserRepository userRepository;
    public RegisteredUser register(String email, String password){
        RegisteredUser user = new RegisteredUser();
        user.setEmail(email);
        user.setPassword(password);

        return userRepository.save(user);
    }

    public String login(String email, String password) {
        Optional<RegisteredUser> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()){
            RegisteredUser user = userOpt.get();
            if (password.matches(user.getPassword()));
            {
                return "Successfully logged in"; //would be where we return the jwt token?
            }
        }
        throw new RuntimeException("Invalid Email or Password");
    }
}
