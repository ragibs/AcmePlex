package com.acmeplex.acmeplex_backend.repository;

import com.acmeplex.acmeplex_backend.model.PaymentInfo;
import com.acmeplex.acmeplex_backend.model.RegisteredUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {
    //IN the event we decided to have more than one payment for a registered user.
//    List<PaymentInfo> findByUserId(Long userId);
    Optional<PaymentInfo> findByRegisteredUser_Email(String email);
}

