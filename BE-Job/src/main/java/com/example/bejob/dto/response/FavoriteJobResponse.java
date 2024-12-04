package com.example.bejob.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteJobResponse {
    private Long jobId;
    private String title;
    private String description;
    private String requirements;
    private String location;
    private String salary;
    private LocalDateTime createdAt;
    private LocalDateTime updateAtJob;
    // Thông tin về công ty
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private String companyAddress;
}
