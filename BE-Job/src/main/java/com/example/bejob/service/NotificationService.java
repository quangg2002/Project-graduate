package com.example.bejob.service;

import com.example.bejob.entity.Notification;
import com.example.bejob.entity.*;
import com.example.bejob.repository.*;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final LanguageService languageService;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public ResponseEntity<ResponseDto<Object>> markAllNotifications() {
        try {
            String userName = authenticationService.getUserFromContext();

            System.out.println("userName: " + userName);

            Optional<User> optionalUser = userRepository.findByUsername(userName);

            if (optionalUser.isEmpty()) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("auth.signup.user.not.found"),
                        StatusCodeEnum.AUTH0016
                );
            }

            User user = optionalUser.get();

            List<Notification> notifications = notificationRepository.findAllByUserId(user.getId(), Sort.by(Sort.Order.desc("createdAt")));
            System.out.println("notifications" + notifications);

            notifications.forEach(notification -> notification.setRead(true));
            notificationRepository.saveAll(notifications);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("mark.notifications.read.success"),
                    StatusCodeEnum.NOTIFICATION1000
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("mark.notifications.read.failed"),
                    StatusCodeEnum.NOTIFICATION0000
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> markNotification(Long id) {
        try {
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException(languageService.getMessage("mark.notifications.read.failed")));

            notification.setRead(true);
            notificationRepository.save(notification);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("mark.notifications.read.success"),
                    StatusCodeEnum.NOTIFICATION1000
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("mark.notifications.read.failed"),
                    StatusCodeEnum.NOTIFICATION0000
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getNotification() {
        try {
            String userName = authenticationService.getUserFromContext();

            Optional<User> optionalUser = userRepository.findByUsername(userName);

            if (optionalUser.isEmpty()) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("auth.signup.user.not.found"),
                        StatusCodeEnum.AUTH0016
                );
            }

            User user = optionalUser.get();

            List<Notification> list = notificationRepository.findAllByUserId(user.getId(), Sort.by(Sort.Order.desc("createdAt")));

            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.notification.success"),
                    list,
                    StatusCodeEnum.NOTIFICATION1001
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.notification.failed"),
                    StatusCodeEnum.NOTIFICATION0001
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> deleteNotification(Long id) {
        try {
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException(languageService.getMessage("not.found.job")));

            notificationRepository.delete(notification);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.notification.success"),
                    StatusCodeEnum.NOTIFICATION1000
            );
        } catch (NoSuchElementException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("Get notification failed"),
                    StatusCodeEnum.NOTIFICATION0001
            );
        } catch (RuntimeException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("Get notification failed"),
                    StatusCodeEnum.NOTIFICATION0001
            );
        }
    }
}