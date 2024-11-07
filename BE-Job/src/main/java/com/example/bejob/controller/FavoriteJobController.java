package com.example.bejob.controller;

import com.example.bejob.model.ResponseDto;
import com.example.bejob.service.FavoriteJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/favorite-job")
public class FavoriteJobController {
    private final FavoriteJobService favoriteJobService;

    @PostMapping("/{jobId}")
    public ResponseEntity<ResponseDto<Object>> toggleFavoriteJob(@PathVariable Long jobId) {
        return favoriteJobService.createJob(jobId);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<Object>> getAllFavoriteJobs() {
        return favoriteJobService.getAllFavoriteJobs();
    }
}
