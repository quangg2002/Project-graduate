package com.example.bejob.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCompanyDetailsResponse {
    private Long jobId;
    private String jobTitle;
    private String jobSalary;
    private String jobDeadline;
    private String jobCity;
}
