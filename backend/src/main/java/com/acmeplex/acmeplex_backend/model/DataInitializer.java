//package com.acmeplex.acmeplex_backend.model;
//
//import com.acmeplex.acmeplex_backend.repository.RegisteredUserRepository;
//import com.acmeplex.acmeplex_backend.repository.UserRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final RegisteredUserRepository registeredUserRepository;
//
//    public DataInitializer(UserRepository userRepository, RegisteredUserRepository registeredUserRepository) {
//        this.userRepository = userRepository;
//        this.registeredUserRepository = registeredUserRepository;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        // Create a few regular users
//        User user1 = new User();
//        user1.setEmail("regularuser1@example.com");
//        userRepository.save(user1);
//
//        User user2 = new User();
//        user2.setEmail("regularuser2@example.com");
//        userRepository.save(user2);
//
//        // Create a few registered users
//        RegisteredUser regUser1 = new RegisteredUser();
//        regUser1.setEmail("registereduser1@example.com");
//        regUser1.setPassword("password123"); // Use an encoder in production
//        regUser1.setName("Alice");
//        registeredUserRepository.save(regUser1);
//
//        RegisteredUser regUser2 = new RegisteredUser();
//        regUser2.setEmail("registereduser2@example.com");
//        regUser2.setPassword("securepassword456");
//        regUser2.setName("Bob");
//        registeredUserRepository.save(regUser2);
//
//        System.out.println("Sample users added to the database.");
//    }
//}
//
