package com.example.bejob.controller;

import com.example.bejob.dto.request.JobRequest;
import com.example.bejob.dto.request.JobSearchRequest;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/job")
public class JobController {

    private final JobService jobService;

    @PostMapping()
    public ResponseEntity<ResponseDto<Object>> createJob(@Valid @RequestBody JobRequest jobRequest) {
        return jobService.createJob(jobRequest);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseDto<Object>> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest jobRequest) {
        return jobService.updateJob(id, jobRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto<Object>> getJob(@PathVariable Long id) {
        return jobService.getJobDetail(id);
    }


    @GetMapping("/with-company")
    public ResponseEntity<ResponseDto<Object>> getJobWithCompany() {
        return jobService.getAllJobsWithCompany();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto<Object>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return jobService.deleteJob(id);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchJobs(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) Long city,
            @RequestParam(required = false) List<Long> industryIds,
            @RequestParam(required = false) List<Long> positionIds,
            @RequestParam(required = false) List<Long> experienceIds,
            @RequestParam(required = false) List<Long> educationIds,
            @RequestParam(required = false) List<Long> jobTypeIds,
            @RequestParam(required = false) List<Long> contractTypeIds
    ) {
        JobSearchRequest searchRequest = JobSearchRequest.builder()
                .searchQuery(searchQuery)
                .city(city)
                .industryIds(industryIds)
                .positionIds(positionIds)
                .experienceIds(experienceIds)
                .educationIds(educationIds)
                .jobTypeIds(jobTypeIds)
                .contractTypeIds(contractTypeIds)
                .build();
        return jobService.searchJobs(searchRequest);
    }

}
