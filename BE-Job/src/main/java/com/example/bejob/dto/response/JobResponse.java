package com.example.bejob.dto.response;

import com.example.bejob.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String location;
    private String district;
    private String city;
    private String deadline;
    private String description;
    private String requirement;
    private String yearExperience;
    private String benefit;
    private String workingTime;
    private String salary;
    private String position;
    private String jobType;
    private String contractType;
    private String email;
    private Company company;
    private EmployerResponse employer;
    private LocalDateTime createdAt;
    private Boolean active;
}