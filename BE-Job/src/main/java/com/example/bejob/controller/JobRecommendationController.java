package com.example.bejob.controller;

import com.example.bejob.dto.JobRecommendDto;
import com.example.bejob.service.CosineSimilarityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/job-recommend")
public class JobRecommendationController {

    private final CosineSimilarityService cosineSimilarityService;

    @GetMapping
    public List<JobRecommendDto> recommendJobs() {
        return cosineSimilarityService.recommendJob();
    }
}
