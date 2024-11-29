package com.acmeplex.acmeplex_backend.ObserverPattern;

import jakarta.mail.MessagingException;

public interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers(String announcement) throws MessagingException;
}
