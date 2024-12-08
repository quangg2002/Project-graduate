package com.example.bejob.dto.response;

import com.example.bejob.dto.UserInfoDto;
import com.example.bejob.entity.Employer;
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
    private Long userId;
    private Long quantityApplication;
    private String title;
    private String position;
    private String location;
    private String district;
    private String city;
    private String deadline;
    private LocalDateTime createdAt;
    private String jobType;
    private String contractType;
    private String salary;
    private String companyName;
    private String companyLogo;
    private String companyDescription;
    private Long quantity;
    private String description;
    private String requirement;
    private String benefit;
    private String workingTime;
    private String yearExperience;
}
