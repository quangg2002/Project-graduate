package com.example.bejob.controller;

    import com.example.bejob.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bejob.model.ResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/create")
    public void createNotification() {
        notificationService.createNotification(13L, 30L, "REJECTED");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ResponseDto<Object>> getNotifications(@PathVariable Long userId) {
        return notificationService.getNotification(userId);
    }

    @PatchMapping("/mark-read/{userId}")
    public ResponseEntity<ResponseDto<Object>> markAllNotificationsAsRead(@PathVariable Long userId) {
        return notificationService.markAllNotifications(userId);
    }
}