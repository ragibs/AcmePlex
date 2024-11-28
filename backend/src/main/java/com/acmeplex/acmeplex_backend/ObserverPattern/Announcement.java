package com.acmeplex.acmeplex_backend.ObserverPattern;

import java.util.ArrayList;
import java.util.List;

public class Announcement implements Subject{
    private List<Observer> observers = new ArrayList<>();
    private String announcement;

    @Override
    public void attach(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void detach(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(announcement);
        }
    }

    public void makeAnnouncement(String announcement) {
        this.announcement = announcement;
        notifyObservers();
    }
}
