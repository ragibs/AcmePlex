package com.acmeplex.acmeplex_backend.controller;

import com.acmeplex.acmeplex_backend.service.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final TokenService tokenService;

    public AuthController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public String token(Authentication authentication){
        logger.debug("Token request for user: {}", authentication.getName());
        String token = tokenService.generateToken(authentication);
        logger.debug("Token Granted {}", token);
        return token;
    }
}
