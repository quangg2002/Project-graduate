package com.example.bejob.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteJobDetailDto {
    private Long jobId;
    private String title;
    private String description;
    private String requirements;
    private String location;
    private Long salary;
    private String status;
}
