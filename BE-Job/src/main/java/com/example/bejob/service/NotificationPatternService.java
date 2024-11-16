package com.example.bejob.service;

import com.example.bejob.dto.request.NotificationPatternRequest;
import com.example.bejob.entity.NotificationPattern;

public interface NotificationPatternService {
    NotificationPattern save(NotificationPatternRequest notificationPattern);
}