package com.example.bejob.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CvListResponse {
    private Long cvId;
    private String cvName;
    private LocalDateTime cvUpdate;
}
