package com.example.bejob.security.service;

import com.example.bejob.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {

    String generateToken(User user);

    String extractUsername(String token);

    boolean isTokenValid(String token, UserDetails user);

    void invalidateToken(String token);
}