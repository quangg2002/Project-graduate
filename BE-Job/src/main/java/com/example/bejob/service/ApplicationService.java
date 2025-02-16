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
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.expression.ExpressionException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final EmployerRepository employerRepository;
    private final CompanyRepository companyRepository;
    private final PositionRepository positionRepository;
    @Value("${minio.url.public}")
    private String publicUrl;

    private final NotificationService notificationService;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final EmployeeRepository employeeRepository;
    private final LanguageService languageService;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final FileService fileService;
    private final MailService mailService;

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


            Optional<Company> company = companyRepository.findByEmployerId(job.get().getEmployer());
            if (company.isEmpty()) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("not.found.company"),
                        StatusCodeEnum.COMPANY0002
                );
            }
            System.out.println("company: " + company.get());
//
            boolean hasApplied = applicationRepository.existsByEmployeeIdAndJobId(employee.getId(), applicationRequest.getJobId());
            if (hasApplied) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("application.already.submitted"),
                        StatusCodeEnum.APPLICATION0001
                );
            }

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

            Employer employer = employerRepository.findById(job.get().getEmployer()).get();

            Notification notification = Notification.builder()
                    .userId(employer.getUserId())
                    .content(user.getFullName() + " đã gửi thư ứng tuyển mới tại " + job.get().getTitle())
                    .jobId(applicationRequest.getJobId())
                    .avatar(user.getAvatar())
                    .read(false)
                    .build();

            notificationService.createNotification(notification);

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

    public ResponseEntity<ResponseDto<List<ApplicationResponse>>> getApplicationWithCompany() {
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

                        User userEmployee = userRepository.findById(employee.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                        return ApplicationResponse.builder()
                                .id(application.getId())
                                .jobId(job.getId())
                                .jobTitle(job.getTitle())
                                .position(positionRepository.findById(job.getPositionId())
                                        .map(Position::getName)
                                        .orElse(null)
                                )
                                .userEmployeeId(userEmployee.getId())
                                .userEmployerId(employer.getUserId())
                                .avatarEmployee(userEmployee.getAvatar())
                                .salary(job.getSalary())
                                .address(job.getLocation())
                                .cvPdf(application.getCvPdf())
                                .employeeId(employee.getId())
                                .companyName(company.get().getCompanyName())
                                .companyAvata(company.get().getLogo())
                                .fullName(userRepository.findById(employee.getUserId()).get().getFullName())
                                .email(userRepository.findById(employee.getUserId()).get().getEmail())
                                .phoneNumberEmployee(userRepository.findById(employee.getUserId()).get().getPhoneNumber())
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
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    "get list fail",
                    StatusCodeEnum.APPLICATION0001
            );
        }
    }

    public ResponseEntity<ResponseDto<List<ApplicationResponse>>> getAllApplications() {

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

            List<Application> applications = applicationRepository.findByEmployeeId(employee.getId());

            List<ApplicationResponse> applicationResponses = applications.stream()
                    .map(application -> {
                        Job job = jobRepository.findById(application.getJobId())
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                        Company company = companyRepository.findById(application.getCompanyId())
                                .orElseThrow(() -> new RuntimeException("Company not found"));

                        Employer employer = employerRepository.findById(job.getEmployer())
                                .orElseThrow(() -> new RuntimeException("Employer not found"));

                        return ApplicationResponse.builder()
                                .id(application.getId())
                                .jobId(job.getId())
                                .companyId(company.getId())
                                .jobTitle(job.getTitle())
                                .salary(job.getSalary())
                                .address(job.getLocation())
                                .cvPdf(application.getCvPdf())
                                .employeeId(employee.getId())
                                .userEmployerId(employer.getUserId())
                                .avatarEmployer(userRepository.findById(employer.getUserId())
                                        .map(User::getAvatar)
                                        .orElse(null)
                                )
                                .fullNameEmployer(userRepository.findById(employer.getUserId())
                                        .map(User::getFullName)
                                        .orElse(null)
                                )
                                .companyName(company.getCompanyName())
                                .companyAvata(company.getLogo())
                                .fullName(userRepository.findById(employee.getUserId()).get().getFullName())
                                .email(userRepository.findById(employee.getUserId()).get().getEmail())
                                .coverLetter(application.getCoverLetter())
                                .status(application.getStatus())
                                .createdAt(application.getCreatedAt())
                                .build();
                    })
                    .collect(Collectors.toList());
            return ResponseBuilder.okResponse(
                    languageService.getMessage("application.create.success"),
                    applicationResponses,
                    StatusCodeEnum.APPLICATION1000
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    "FALSE",
                    StatusCodeEnum.APPLICATION0001
            );
        }
    }

    public ResponseEntity<ResponseDto<ApplicationResponse>> updateStatus(Long id, ApplicationStatus status) throws MessagingException {
        // Cập nhật status
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ExpressionException("Application not found with id: " + id));
        application.setStatus(status);
        applicationRepository.save(application);

        Optional<Employee> employee = employeeRepository.findById(application.getEmployeeId());
        if (employee.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("not.found.employee"),
                    StatusCodeEnum.EMPLOYER4000
            );
        }

        Optional<Job> jobOptional = jobRepository.findById(application.getJobId());
        if (jobOptional.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("not.found.job"),
                    StatusCodeEnum.JOB4000
            );
        }

        Company company = companyRepository.findById(application.getCompanyId()).orElse(null);

        Notification notification = Notification.builder()
                .userId(employee.get().getUserId())
                .avatar(company.getLogo())
                .companyId(company.getId())
                .jobId(jobOptional.get().getId())
                .content("Công ty " + company.getCompanyName() + " đã phản hồi thư đăng tuyển của bạn.")
                .read(false)
                .build();

        notificationService.createNotification(notification);

        Job job = jobOptional.get();

        Optional<Employer> employer = employerRepository.findById(job.getEmployer());
        if (employer.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("not.found.employer"),
                    StatusCodeEnum.EMPLOYER4000
            );
        }

        User user = userRepository.findById(employee.get().getUserId()).get();

        ApplicationResponse applicationResponse = ApplicationResponse.builder()
                .id(application.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .address(job.getLocation())
                .employeeId(employee.get().getId())
                .cvPdf(application.getCvPdf())
                .cvPdf(application.getCvPdf())
                .fullName(user.getFullName())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .createdAt(application.getCreatedAt())
                .build();

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("employeeName", user.getFullName());
        templateModel.put("jobTitle", job.getTitle());
        templateModel.put("employerName", user.getFullName());
        templateModel.put("status", application.getStatus());

        mailService.sendJobApplicationEmail(user.getEmail(), job.getTitle(), templateModel);

        return ResponseBuilder.badRequestResponse(
                "Update status successfully",
                applicationResponse,
                StatusCodeEnum.APPLICATION1000
        );
    }

    public ResponseEntity<ResponseDto<Object>> delete(Long id) {
        try{
            applicationRepository.deleteById(id);
            return ResponseBuilder.badRequestResponse(
                    "Update status successfully",
                    StatusCodeEnum.APPLICATION1000
            );
        }catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    "Update status successfully",
                    StatusCodeEnum.APPLICATION1000
            );
        }
    }
}
