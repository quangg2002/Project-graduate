package com.example.bejob.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobSearchRequest {
    private String searchQuery;
    private Long city;
    private List<Long> industryIds;
    private List<Long> positionIds;
    private List<Long> experienceIds;
    private List<Long> educationIds;
    private List<Long> jobTypeIds;
    private List<Long> contractTypeIds;
}
