package com.example.bejob.service;

import com.example.bejob.dto.request.NotificationRequest;
import jakarta.mail.MessagingException;

public interface NotificationService {
    void save(NotificationRequest req) throws MessagingException;
}