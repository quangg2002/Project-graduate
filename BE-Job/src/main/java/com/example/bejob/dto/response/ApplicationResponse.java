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
    private String jobTitle;
    private String address;
    private Long employeeId;
    private String cvPdf;
    private String fullName;
    private String email;
    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime createdAt;
}
