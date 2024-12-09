package com.example.bejob.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRecommendResponse {
    public Long jobId;
    public String jobTitle;
    public String companyName;
    public String companyLogo;
    public String jobDescription;
    public Long companyId;
    public String jobDeadline;
    public List <String> nameSkill;
    public String jobSalary;
    private double similarity;
}
