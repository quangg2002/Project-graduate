package com.example.bejob.service.impl;

import com.example.bejob.dto.request.NotificationRequest;
import com.example.bejob.entity.Notification;
import com.example.bejob.repository.NotificationRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl {

    private final ModelMapper modelMapper;
    private final NotificationRepository repository;

    public void save(NotificationRequest req) throws MessagingException {
        Notification notification = repository.save(modelMapper.map(req, Notification.class));
//        NotificationPattern notificationPattern = patternRepository.findById(notification.getPatternId()).orElse(null);
//        if (notificationPattern != null) {
//            if (notificationPattern.getIsHtml()) {
//                mailService.sendHtmlEmail(String.valueOf(notification.getToUserId()), notificationPattern.getSubject(), notificationPattern.getContent());
//            } else
//                mailService.sendMail(String.valueOf(notification.getToUserId()), notificationPattern.getSubject(), notificationPattern.getContent());
//        }
//        throw new MessagingException("Error when sending mail.");
    }
}