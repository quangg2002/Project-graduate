package com.example.bejob.service;

import com.example.bejob.dto.response.FavoriteJobResponse;
import com.example.bejob.entity.*;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.repository.*;
import com.example.bejob.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FavoriteJobService {

    private final UserRepository userRepository;
    private final LanguageService languageService;
    private final ModelMapper modelMapper;
    private final EmployeeRepository employeeRepository;
    private final FavoriteJobRepository favoriteJobRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final AuthenticationService authenticationService;

    public ResponseEntity<ResponseDto<Object>> createJob(Long jobId) {

        String userName = authenticationService.getUserFromContext();

        Optional<User> optionalUser = userRepository.findByUsername(userName);

        if (optionalUser.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("auth.signup.user.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        User user = optionalUser.get();

        Employee employee = employeeRepository.findByUserId(user.getId());
        if (employee == null) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employee.not.found"),
                    StatusCodeEnum.EMPLOYER4000
            );
        }

        try {
            Optional<FavoriteJob> existingFavoriteJob = favoriteJobRepository.findByUserIdAndJobId(employee.getUserId(), jobId);

            if (existingFavoriteJob.isPresent()) {
                favoriteJobRepository.delete(existingFavoriteJob.get());
                return ResponseBuilder.okResponse(
                        languageService.getMessage("delete.favorite-job.success"),
                        null,
                        StatusCodeEnum.JOB1001
                );
            } else {
                FavoriteJob favoriteJob = FavoriteJob.builder()
                        .userId(employee.getUserId())
                        .jobId(jobId)
                        .build();

                favoriteJobRepository.save(favoriteJob);

                return ResponseBuilder.okResponse(
                        languageService.getMessage("create.favorite-job.success"),
                        favoriteJob,
                        StatusCodeEnum.JOB1000
                );
            }
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("create.favorite-job.failed"),
                    StatusCodeEnum.JOB0000
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getAllFavoriteJobs() {

        String userName = authenticationService.getUserFromContext();

        Optional<User> optionalUser = userRepository.findByUsername(userName);

        if (optionalUser.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("auth.signup.user.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        User user = optionalUser.get();

        Employee employee = employeeRepository.findByUserId(user.getId());
        if (employee == null) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employee.not.found"),
                    StatusCodeEnum.EMPLOYER4000
            );
        }

        try {
            List<FavoriteJob> favoriteJobs = favoriteJobRepository.findByUserId(employee.getUserId());
            System.out.println(favoriteJobs);

            List<FavoriteJobResponse> favoriteJobResponses = favoriteJobs.stream()
                    .map(favJob -> {
                        Job job = jobRepository.findById(favJob.getJobId()).orElse(null);
                        System.out.println("job: " + favJob.getJobId() + job);
                        if (job == null) {
                            return null;
                        }
                        System.out.println(job.getEmployer());
                        Company company = companyRepository.findById(job.getEmployer()).orElse(null);
                        System.out.println("company" +company);
                        return new FavoriteJobResponse(
                                job.getId(),
                                job.getTitle(),
                                job.getDescription(),
                                job.getRequirements(),
                                job.getLocation(),
                                job.getSalary(),
                                job.getStatus() != null ? job.getStatus().name() : null,
                                company != null ? company.getId() : null,
                                company != null ? company.getCompanyName() : null,
                                company != null ? company.getLogo() : null,
                                company != null ? company.getAddress() : null
                        );
                    })
                    .filter(Objects::nonNull) // Loại bỏ các mục null trong danh sách
                    .collect(Collectors.toList());

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.all.jobs.success"),
                    favoriteJobResponses,
                    StatusCodeEnum.JOB1001
            );

        } catch (RuntimeException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.all.jobs.failed"),
                    StatusCodeEnum.JOB0001
            );
        }
    }
}

