package com.example.bejob.service;

import jakarta.mail.MessagingException;
import org.springframework.scheduling.annotation.Async;

import java.util.Map;

public interface MailService {
    boolean sendMail(String to, String subject, String text);

    boolean sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException;

    @Async
    void sendEmailFollow(String toEmail, String companyName, String jobPostUrl) throws MessagingException;

    @Async
    void sendPasswordResetEmail(String to, String newPassword) throws Exception;

    @Async
    void sendJobApplicationEmail(String to, String subject, Map<String, Object> templateModel) throws MessagingException;
}