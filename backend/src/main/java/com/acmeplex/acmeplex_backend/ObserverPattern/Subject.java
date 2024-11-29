package com.acmeplex.acmeplex_backend.ObserverPattern;

public interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers(String announcement);
}
