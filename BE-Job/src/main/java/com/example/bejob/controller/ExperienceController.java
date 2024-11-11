package com.example.bejob.controller;

import com.example.bejob.entity.Experience;
import com.example.bejob.dto.request.ExperienceRequest;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.service.ExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/experience")
public class ExperienceController {

    private final ExperienceService experienceService;

    @PostMapping()
    public ResponseEntity<ResponseDto<Object>> createExperience(@Valid @RequestBody ExperienceRequest experienceRequest) {
        return experienceService.createExperience(experienceRequest);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseDto<Object>> updateExperience(@PathVariable Long id, @Valid @RequestBody ExperienceRequest experienceRequest) {
        return experienceService.updateExperience(id, experienceRequest);
    }

    @GetMapping("/list")
    public ResponseEntity<ResponseDto<List<Experience>>> getExperience() {
        return experienceService.getExperience();
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ResponseDto<Experience>> getExperience(@PathVariable Long id) {
        return experienceService.getExperienceById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto<Object>> deleteExperience(@PathVariable Long id) {
        return experienceService.deleteExperience(id);
    }
}
