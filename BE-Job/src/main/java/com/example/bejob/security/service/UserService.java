package com.example.bejob.security.service;

import com.example.bejob.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {

    UserDetailsService userDetailsService();

    User getByUserEmail(String email);

    User getByUserName(String userName);

}
