package com.example.bejob.controller;

import com.example.bejob.model.ResponseDto;
import com.example.bejob.service.FollowCompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
@RequestMapping("/follow-company")
public class FollowCompanyController {

    private final FollowCompanyService followCompanyService;

    @PostMapping("/{companyId}")
    public ResponseEntity<ResponseDto<Object>> createFollowCompany(@PathVariable Long companyId) {
        return followCompanyService.followCompany(companyId);
    }

    @GetMapping("/list")
    public ResponseEntity<ResponseDto<Object>> getFollowCompany() {
        return followCompanyService.getFollowCompany();
    }
}