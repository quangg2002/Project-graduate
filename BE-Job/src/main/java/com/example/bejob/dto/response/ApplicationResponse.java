package com.example.bejob.dto.response;

import com.example.bejob.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String companyName;
    private String companyAvata;
    private String jobTitle;
    private String position;
    private String salary;
    private String address;
    private Long employeeId;
    private Long userEmployerId;
    private String fullNameEmployer;
    private String avatarEmployer;
    private String cvPdf;
    private String fullName;
    private String email;
    private String phoneNumberEmployee;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime createdAt;
}
