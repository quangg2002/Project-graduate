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

    @GetMapping()
    public ResponseEntity<ResponseDto<Object>> getNotifications() {
        return notificationService.getNotification();
    }

    @PatchMapping("/mark-read")
    public ResponseEntity<ResponseDto<Object>> markAllNotificationsAsRead() {
        return notificationService.markAllNotifications();
    }

    @PatchMapping("/mark-read/{id}")
    public ResponseEntity<ResponseDto<Object>> markNotificationsAsRead(@PathVariable Long id) {
        return notificationService.markNotification(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto<Object>> deleteNotification(@PathVariable Long id) {
        return notificationService.deleteNotification(id);
    }
}