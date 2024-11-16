package com.example.bejob.dto.response;

import com.example.bejob.dto.UserInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobWithCompanyResponse {
    private Long id;
    private String title;
    private String location;
    private String district;
    private String city;
    private String deadline;
    private String salary;
    private String jobType;
    private String yearExperience;
    private LocalDateTime createdAt;
    private String companyName;
    private String companyLogo;
    private String companyDescription;
    private String companyAddress;
    private UserInfoDto employer;
}