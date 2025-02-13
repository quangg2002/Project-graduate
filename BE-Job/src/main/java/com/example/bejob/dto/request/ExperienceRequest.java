package com.example.bejob.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceRequest {
    private String companyName;

    private Long position;

    private LocalDate startDate;

    private LocalDate endDate;

    private String description;

    private Long yearExperience;
}
