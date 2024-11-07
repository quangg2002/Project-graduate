package com.example.bejob.service;

import com.example.bejob.entity.*;
import com.example.bejob.repository.*;
import com.example.bejob.dto.UserInfoDto;
import com.example.bejob.dto.request.JobRequest;
import com.example.bejob.dto.response.JobResponse;
import com.example.bejob.dto.response.JobWithCompanyResponse;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final LanguageService languageService;
    private final EmployerRepository employerRepository;
    private final ModelMapper modelMapper;

    public ResponseEntity<ResponseDto<Object>> createJob(JobRequest jobRequest) {

        String userName = authenticationService.getUserFromContext();

        Optional<User> optionalUser = userRepository.findByUsername(userName);

        if (optionalUser.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("auth.signup.user.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        User user = optionalUser.get();

        Employer employer = employerRepository.findByUserId(user.getId());
        if (employer == null) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employer.not.found"),
                    StatusCodeEnum.EMPLOYER4000
            );
        }

        try {
            Job job = modelMapper.map(jobRequest, Job.class);
            job.setEmployer(employer.getId());

            jobRepository.save(job);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("create.job.success"),
                    job,
                    StatusCodeEnum.JOB1000
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("create.job.failed"),
                    StatusCodeEnum.JOB0000
            );
        }
    }
}