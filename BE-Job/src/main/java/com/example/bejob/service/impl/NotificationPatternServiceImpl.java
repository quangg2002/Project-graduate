package com.example.bejob.service.impl;

import com.example.bejob.dto.request.NotificationPatternRequest;
import com.example.bejob.entity.NotificationPattern;
import com.example.bejob.repository.NotificationPatternRepository;
import com.example.bejob.service.NotificationPatternService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationPatternServiceImpl implements NotificationPatternService {

    private final ModelMapper modelMapper;
    private final NotificationPatternRepository repository;

    public NotificationPattern save(NotificationPatternRequest notificationPattern) {
        return repository.save(modelMapper.map(notificationPattern, NotificationPattern.class));
    }
}
