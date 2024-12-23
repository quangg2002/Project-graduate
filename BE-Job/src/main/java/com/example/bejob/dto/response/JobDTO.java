package com.example.bejob.dto.response;

import com.example.bejob.dto.UserInfoDto;
import com.example.bejob.entity.Skill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private Long id;
    private String title;
    private String location;
    private Long district;
    private Long city;
    private String deadline;
    private String description;
    private String requirement;
    private Long yearExperience;
    private String benefit;
    private String workingTime;
    private String salary;
    private Long position;
    private Long quantity;
    private Long jobType;
    private Long contractType;
    private Long education;
    private Long industry;
    private String email;
    private LocalDateTime createdAt;
    private List<Long> skillsJob;
}