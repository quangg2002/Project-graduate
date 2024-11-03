package com.example.bejob.service;

import jakarta.mail.MessagingException;

public interface MailService {
    boolean sendMail(String to, String subject, String text);

    boolean sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException;

    void sendPasswordResetEmail(String to, String newPassword) throws Exception;
}
