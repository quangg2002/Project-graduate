package com.example.bejob.service;

import com.example.bejob.dto.request.JobRequest;
import com.example.bejob.dto.response.EmployerResponse;
import com.example.bejob.dto.response.JobDTO;
import com.example.bejob.dto.response.JobResponse;
import com.example.bejob.dto.response.JobWithCompanyResponse;
import com.example.bejob.entity.*;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.repository.*;
import com.example.bejob.security.service.AuthenticationService;
import com.example.bejob.enums.StatusCodeEnum;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final LanguageService languageService;
    private final ModelMapper modelMapper;
    private final EmployerRepository employerRepository;
    private final DistrictRepository districtRepository;
    private final CityRepository cityRepository;
    private final YearExperienceRepository experienceRepository;
    private final PositionRepository positionRepository;
    private final JobTypeRepository jobTypeRepository;
    private final ContractTypeRepository contractTypeRepository;
    private final CompanyRepository companyRepository;
    private final EntityManager entityManager;
    private final IndustryRepository industryRepository;
    private final EducationLevelRepository educationLevelRepository;
    private final JobSkillRepository jobSkillRepository;
//    private final FollowCompanyService followCompanyService;
    private final NotificationService notificationService;
    private final EmployeeRepository employeeRepository;
    private final MailService mailService;
    private final YearExperienceRepository yearExperienceRepository;
    private final ApplicationRepository applicationRepository;

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
            Job job = new Job();
            modelMapper.map(jobRequest, job);
            job.setEmployer(employer.getId());

            Job savedJob = jobRepository.save(job);

            notificationService.createNotification(employer.getUserId(), job.getId(), "JOB_POSTED");

            if (jobRequest.getSkills() != null && !jobRequest.getSkills().isEmpty()) {
                List<JobSkill> jobSkills = jobRequest.getSkills().stream()
                        .map(skillId -> JobSkill.builder()
                                .jobId(savedJob.getId())
                                .skillId(skillId)
                                .build())
                        .collect(Collectors.toList());

                // Lưu các JobSkill vào database
                jobSkillRepository.saveAll(jobSkills);
            }

//            List<FollowCompany> followCompany = followCompanyService.getListFollow();
//
//            for(FollowCompany follow: followCompany){
//                if(follow.getCompanyId() == employer.getCompany()){
//
//                    Optional<User> user1 = userRepository.findById(follow.getEmployeeId());
//
//                    notificationService.createNotification(follow.getEmployeeId(), job.getId(), "FOLLOW");
//                    mailService.sendEmailFollow(user1.get().getEmail(), companyRepository.findById(employer.getCompany()).get().getCompanyName(), "https://deploy-hirexptit.io.vn/");
//                }
//            }

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

    public ResponseEntity<ResponseDto<Object>> updateJob(Long id, JobRequest jobRequest) {
        try {
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException("Not found job"));

            if (jobRequest != null) {
                modelMapper.map(jobRequest, job);
            }

            jobRepository.save(job);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("update.job.success"),
                    job,
                    StatusCodeEnum.JOB1002
            );
        } catch (NoSuchElementException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("not.found.job"),
                    StatusCodeEnum.JOB4000
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("update.job.failed"),
                    StatusCodeEnum.JOB0002
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getJob(Long id) {
        try {
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException(languageService.getMessage("not.found.job")));

            JobDTO jobResponse = modelMapper.map(job, JobDTO.class);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.job.success"),
                    jobResponse,
                    StatusCodeEnum.JOB1001
            );
        } catch (NoSuchElementException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("not.found.job"),
                    StatusCodeEnum.JOB4000
            );
        } catch (RuntimeException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.job.failed"),
                    StatusCodeEnum.JOB0001
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getAllJobsWithCompany() {
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
                        languageService.getMessage("employer.not.found"),
                        StatusCodeEnum.EMPLOYER4000
                );
            }

            Optional<Company> company = companyRepository.findByEmployerId(employer.getId());
            List<Job> jobs = new ArrayList<>();

            if (company.isPresent()) {
                List<Employer> listEmployerWithCompany = employerRepository.findByCompany(company.get().getId());

                for (Employer e : listEmployerWithCompany) {
                    jobs.addAll(jobRepository.findByEmployer(e.getId()));
                }
            }

            List<JobWithCompanyResponse> list = jobs.stream()
                    .sorted(Comparator.comparing(Job::getCreatedAt).reversed())
                    .map(job -> JobWithCompanyResponse.builder()
                            .id(job.getId())
                            .userId(employerRepository.findById(job.getEmployer())
                                    .map(Employer::getUserId)
                                    .orElse(null)
                            )
                            .position(positionRepository.findById(job.getId())
                                    .map(Position::getName)
                                    .orElse(null)
                            )
                            .quantityApplication((long) applicationRepository.findByJobId(job.getId()).size())
                            .createdAt(job.getCreatedAt())
                            .quantity(job.getQuantity())
                            .salary(job.getSalary())
                            .title(job.getTitle())
                            .location(job.getLocation())
                            .district(districtRepository.findById(job.getDistrictId())
                                    .map(District::getName)
                                    .orElse(null))
                            .city(cityRepository.findById(job.getCityId())
                                    .map(City::getName)
                                    .orElse(null))
                            .deadline(job.getDeadline())
                            .jobType(jobTypeRepository.findById(job.getJobTypeId())
                                    .map(JobType::getName)
                                    .orElse(null))
                            .contractType(contractTypeRepository.findById(job.getContractTypeId())
                                    .map(ContractType::getName)
                                    .orElse(null))
                            .description(job.getDescription())
                            .requirement(job.getRequirement())
                            .benefit(job.getBenefit())
                            .workingTime(job.getWorkingTime())
                            .yearExperience(yearExperienceRepository.findById(job.getYearExperience())
                                    .map(YearExperience :: getName)
                                    .orElse(null))
                            .build())
                    .collect(Collectors.toList());

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.all.jobs.success"),
                    list,
                    StatusCodeEnum.JOB1001
            );
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.all.jobs.failed"),
                    StatusCodeEnum.JOB0001
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getJobDetail(Long id) {
        try {
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException(languageService.getMessage("not.found.job")));

            // Lấy thông tin employer và company
            Employer employer = employerRepository.findById(job.getEmployer())
                    .orElse(null);

            Company company = null;
            if (employer != null) {
                company = companyRepository.findById(employer.getCompany())
                        .orElse(null);
            }

            User user = userRepository.findById(employer.getUserId()).orElse(null);

            EmployerResponse employerResponse = EmployerResponse.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .avatar(user.getAvatar())
                    .fullName(user.getFullName())
                    .phoneNumber(user.getPhoneNumber())
                    .build();

            JobResponse jobResponse = JobResponse.builder()
                    .id(job.getId())
                    .title(job.getTitle())
                    .location(job.getLocation())
                    .district(districtRepository.findById(job.getDistrictId()).get().getName())
                    .city(cityRepository.findById(job.getCityId()).get().getName())
                    .deadline(job.getDeadline())
                    .description(job.getDescription())
                    .requirement(job.getRequirement())
                    .yearExperience(experienceRepository.findById(job.getYearExperience()).get().getName())
                    .salary(job.getSalary())
                    .benefit(job.getBenefit())
                    .workingTime(job.getWorkingTime())
                    .position(positionRepository.findById(job.getPositionId()).get().getName())
                    .jobType(jobTypeRepository.findById(job.getJobTypeId()).get().getName())
                    .contractType(contractTypeRepository.findById(job.getContractTypeId()).get().getName())
                    .createdAt(job.getCreatedAt())
                    .company(company)
                    .employer(employerResponse)
                    .build();

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.job.success"),
                    jobResponse,
                    StatusCodeEnum.JOB1001
            );
        } catch (NoSuchElementException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("not.found.job"),
                    StatusCodeEnum.JOB4000
            );
        } catch (RuntimeException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.job.failed"),
                    StatusCodeEnum.JOB0001
            );
        }
    }


    public ResponseEntity<ResponseDto<Object>> deleteJob(Long id) {
        try {
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException(languageService.getMessage("not.found.job")));

            jobRepository.deleteById(id);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("delete.job.success"),
                    StatusCodeEnum.JOB1003
            );
        } catch (NoSuchElementException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("not.found.job"),
                    StatusCodeEnum.JOB4000
            );
        } catch (RuntimeException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("delete.job.failed"),
                    StatusCodeEnum.JOB0003
            );
        }
    }
}