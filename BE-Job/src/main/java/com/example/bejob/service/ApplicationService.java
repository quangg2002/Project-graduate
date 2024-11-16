package com.example.bejob.service;

import com.example.bejob.entity.*;
import com.example.bejob.enums.ApplicationStatus;
import com.example.bejob.repository.*;
import com.example.bejob.dto.request.ApplicationRequest;
import com.example.bejob.dto.response.ApplicationResponse;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.expression.ExpressionException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final EmployerRepository employerRepository;
    private final CompanyRepository companyRepository;
    @Value("${minio.url.public}")
    private String publicUrl;

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final EmployeeRepository employeeRepository;
    private final LanguageService languageService;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final FileService fileService;

    public ResponseEntity<ResponseDto<Object>> createApplication(ApplicationRequest applicationRequest) {
        try {
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
                        languageService.getMessage("not.found.employee"),
                        StatusCodeEnum.EMPLOYER4000
                );
            }

            Optional<Job> job = jobRepository.findById(applicationRequest.getJobId());
            if (job.isEmpty()) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("not.found.job"),
                        StatusCodeEnum.JOB4000
                );
            }
            System.out.println("job: " + job.get().getEmployer());


            Optional <Company> company = companyRepository.findByEmployerId(job.get().getEmployer());
            if (company.isEmpty()) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("not.found.company"),
                        StatusCodeEnum.COMPANY0002
                );
            }
            System.out.println("company: " + company.get());

            Application application = Application.builder()
                    .jobId(applicationRequest.getJobId())
                    .employeeId(employee.getId())
                    .companyId(company.get().getId())
                    .coverLetter(applicationRequest.getCoverLetter())
                    .status(ApplicationStatus.PENDING)
                    .build();

            if (applicationRequest.getCvPdf() != null && !applicationRequest.getCvPdf().isEmpty()) {
                String cv = fileService.uploadFile(applicationRequest.getCvPdf(), "CV");
                if (cv == null) {
                    log.error("Upload file image avatar failed");
                    return ResponseBuilder.badRequestResponse(
                            languageService.getMessage("upload.file.avatar.failed"),
                            StatusCodeEnum.UPLOADFILE0001
                    );
                } else {
                    application.setCvPdf(publicUrl + "/" + cv);
                }
            }

            applicationRepository.save(application);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("application.create.success"),
                    application,
                    StatusCodeEnum.APPLICATION1000
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("application.create.failed"),
                    StatusCodeEnum.APPLICATION0001
            );
        }
    }

    public ResponseEntity<ResponseDto<List<ApplicationResponse>>> getApplicationWithCompany(){
        try{
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
                        languageService.getMessage("not.found.employer"),
                        StatusCodeEnum.EMPLOYER4000
                );
            }

            Optional<Company> company = companyRepository.findByEmployerId(employer.getId());
            if (company == null) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("company.not.found"),
                        StatusCodeEnum.COMPANY0002
                );
            }

            List<Application> applications = applicationRepository.findByCompanyId(company.get().getId());

            List<ApplicationResponse> applicationResponses = applications.stream()
                    .map(application -> {
                        Job job = jobRepository.findById(application.getJobId())
                                .orElseThrow(() -> new RuntimeException("Job not found"));
                        Employee employee = employeeRepository.findById(application.getEmployeeId())
                                .orElseThrow(() -> new RuntimeException("Employee not found"));

                        return ApplicationResponse.builder()
                                .id(application.getId())
                                .jobId(job.getId())
                                .jobTitle(job.getTitle())
                                .address(job.getLocation())
                                .cvPdf(application.getCvPdf())
                                .employeeId(employee.getId())
                                .fullName(userRepository.findById(employee.getUserId()).get().getFullName())
                                .email(userRepository.findById(employee.getUserId()).get().getEmail())
                                .coverLetter(application.getCoverLetter())
                                .status(application.getStatus())
                                .createdAt(application.getCreatedAt())
                                .build();
                    })
                    .collect(Collectors.toList());

            return ResponseBuilder.badRequestResponse(
                    "get list success",
                    applicationResponses,
                    StatusCodeEnum.APPLICATION1000
            );
        }
        catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    "get list fail",
                    StatusCodeEnum.APPLICATION0001
            );
        }
    }

    public ResponseEntity<ResponseDto<List<ApplicationResponse>>> getAllApplications() {
        List<Application> applications = applicationRepository.findAll();

        List<ApplicationResponse> applicationResponses = applications.stream()
                .map(application -> {
                    Job job = jobRepository.findById(application.getJobId())
                            .orElseThrow(() -> new RuntimeException("Job not found"));
                    Employee employee = employeeRepository.findById(application.getEmployeeId())
                            .orElseThrow(() -> new RuntimeException("Employee not found"));

                    return ApplicationResponse.builder()
                            .id(application.getId())
                            .jobId(job.getId())
                            .jobTitle(job.getTitle())
                            .address(job.getLocation())
                            .cvPdf(application.getCvPdf())
                            .employeeId(employee.getId())
                            .fullName(userRepository.findById(employee.getUserId()).get().getFullName())
                            .email(userRepository.findById(employee.getUserId()).get().getEmail())
                            .coverLetter(application.getCoverLetter())
                            .status(application.getStatus())
                            .createdAt(application.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());

        return ResponseBuilder.badRequestResponse(
                "get list success",
                applicationResponses,
                StatusCodeEnum.APPLICATION1000
        );
    }

    public ResponseEntity<ResponseDto<ApplicationResponse>> updateStatus(Long id, ApplicationStatus status) {
        // Cập nhật status
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ExpressionException("Application not found with id: " + id));
        application.setStatus(status);
        applicationRepository.save(application);

        // Lấy thông tin job và employee
        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        Employee employee = employeeRepository.findById(application.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Map sang response
        ApplicationResponse applicationResponse = ApplicationResponse.builder()
                .id(application.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .address(job.getLocation())
                .employeeId(employee.getId())
                .cvPdf(application.getCvPdf())
                .fullName(userRepository.findById(employee.getUserId()).get().getFullName())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .createdAt(application.getCreatedAt())
                .build();

        return ResponseBuilder.badRequestResponse(
                "Update status successfully",
                applicationResponse,
                StatusCodeEnum.APPLICATION1000
        );
    }

}
