package com.example.bejob.controller;

import com.example.bejob.dto.request.ApplicationRequest;
import com.example.bejob.dto.response.ApplicationResponse;
import com.example.bejob.enums.ApplicationStatus;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.service.ApplicationService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/application")
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDto<Object>> createApplication(@Valid @ModelAttribute ApplicationRequest applicationRequest) {
        return applicationService.createApplication(applicationRequest);
    }

    @GetMapping()
    public ResponseEntity<ResponseDto<List<ApplicationResponse>>> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/with-company")
    public ResponseEntity<ResponseDto<List<ApplicationResponse>>> getAllApplicationsWithCompany() {
        return applicationService.getApplicationWithCompany();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponseDto<ApplicationResponse>> updateStatus(
            @PathVariable("id") Long id,
            @RequestParam ApplicationStatus status) throws MessagingException {
        return applicationService.updateStatus(id, status);
    }

    @PatchMapping("/delete/{id}")
    public ResponseEntity<ResponseDto<Object>> delete(@PathVariable("id") Long id) {
        return applicationService.delete(id);
    }
}
