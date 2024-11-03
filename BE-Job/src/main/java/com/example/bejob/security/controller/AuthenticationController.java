package com.example.bejob.security.controller;

import com.example.bejob.dto.request.ForgotPasswordRequest;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.security.dto.request.ChangePasswordRequest;
import com.example.bejob.security.dto.request.SignInRequest;
import com.example.bejob.security.dto.request.SignUpRequest;
import com.example.bejob.security.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<ResponseDto<Object>> login(@Valid @RequestBody SignInRequest request) {
        return authenticationService.authenticate(request);
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDto<Object>> createUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        return authenticationService.createUser(signUpRequest);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseDto<Object>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authenticationService.processForgotPassword(request);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ResponseDto<Object>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return authenticationService.changePassword(request);
    }

//    @PostMapping("/logout")
//    public ResponseEntity<String> logout(HttpServletRequest request) {
//        return new ResponseEntity<>(authenticationService.logout(request), OK);
//    }
}
