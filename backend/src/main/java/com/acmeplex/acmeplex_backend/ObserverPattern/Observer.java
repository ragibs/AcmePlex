package com.acmeplex.acmeplex_backend.ObserverPattern;

import jakarta.mail.MessagingException;

public interface Observer {
    void update(String announcement);
    String getEmail();
}
