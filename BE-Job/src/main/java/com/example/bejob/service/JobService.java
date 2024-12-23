package com.example.bejob.service;

import com.example.bejob.dto.request.JobRequest;
import com.example.bejob.dto.request.JobSearchRequest;
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
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
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
    private final FollowCompanyService followCompanyService;
    private final NotificationService notificationService;
    private final EmployeeRepository employeeRepository;
    private final MailService mailService;
    private final YearExperienceRepository yearExperienceRepository;
    private final ApplicationRepository applicationRepository;
    private final ScaleRepository scaleRepository;

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

            List<FollowCompany> followCompany = followCompanyService.getListFollowCompany(employer.getId());

            if (followCompany != null && !followCompany.isEmpty()) {
                for (FollowCompany follow : followCompany) {
                    Employee employee = employeeRepository.findById(follow.getEmployeeId()).orElse(null);

                    User user1 = userRepository.findById(employee.getUserId()).orElse(null);

                    Company company = companyRepository.findById(follow.getCompanyId()).orElse(null);

                    Notification notification = Notification.builder()
                            .avatar(company.getLogo())
                            .userId(user1.getId())
                            .content("Công ty " +  company.getCompanyName() + " đã đăng tuyển việc làm mới.")
                            .jobId(savedJob.getId())
                            .companyId(company.getId())
                            .read(false)
                            .build();

                    notificationService.createNotification(notification);

                    mailService.sendEmailFollow(user1.getEmail(), companyRepository.findById(employer.getCompany()).get().getCompanyName(), "https://deploy-hirexptit.io.vn/");
                }
            }

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

            List<JobSkill> jobSkills = jobSkillRepository.findByJobId(id);
            jobSkillRepository.deleteAll(jobSkills);

            List<JobSkill> jobSkillList = jobRequest.getSkills().stream()
                    .map(skillId -> JobSkill.builder()
                            .jobId(job.getId())
                            .skillId(skillId)
                            .build())
                    .collect(Collectors.toList());

            jobSkillRepository.saveAll(jobSkillList);

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

            List<JobSkill> skills = jobSkillRepository.findByJobId(id);

            List<Long> skillIds = skills.stream()
                    .map(JobSkill::getSkillId)
                    .collect(Collectors.toList());

            jobResponse.setSkillsJob(skillIds);

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

    public ResponseEntity<ResponseDto<Object>>  getJobDetail(Long id) {
        try {
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException(languageService.getMessage("not.found.job")));

            Employer employer = employerRepository.findById(job.getEmployer())
                    .orElse(null);

            Company company = null;
            if (employer != null) {
                company = companyRepository.findById(employer.getCompany())
                        .orElse(null);
            }

            JobWithCompanyResponse jobResponse = JobWithCompanyResponse.builder()
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
                    .contractType(contractTypeRepository.findById(job.getContractTypeId()).get().getName())
                    .createdAt(job.getCreatedAt())
                    .quantity(job.getQuantity())
                    .companyLogo(company.getLogo())
                    .companyId(company.getId())
                    .companyName(company.getCompanyName())
                    .companyCity(cityRepository.findById(company.getCity())
                            .map(City::getName)
                            .orElse(null)
                    )
                    .companyScale(scaleRepository.findById(company.getScale())
                            .map(Scale::getName)
                            .orElse(null)
                    )
                    .companyAddress(company.getAddress())
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

    @Transactional
    public ResponseEntity<ResponseDto<Object>> searchJobs(JobSearchRequest searchRequest) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Job> query = criteriaBuilder.createQuery(Job.class);
        Root<Job> job = query.from(Job.class);

        List<Predicate> predicates = new ArrayList<>();

        // Apply filters based on input parameters
        if (searchRequest.getSearchQuery() != null) {
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(job.get("title")), "%" + searchRequest.getSearchQuery().toLowerCase() + "%"));
        }
        if (searchRequest.getCity() != null) {
            predicates.add(criteriaBuilder.equal(job.get("cityId"), searchRequest.getCity()));
        }
        if (searchRequest.getExperienceIds() != null && !searchRequest.getExperienceIds().isEmpty()) {
            predicates.add(job.get("yearExperience").in(searchRequest.getExperienceIds()));
        }
        if (searchRequest.getIndustryIds() != null && !searchRequest.getIndustryIds().isEmpty()) {
            predicates.add(job.get("industryId").in(searchRequest.getIndustryIds()));
        }
        if (searchRequest.getJobTypeIds() != null && !searchRequest.getJobTypeIds().isEmpty()) {
            predicates.add(job.get("jobTypeId").in(searchRequest.getJobTypeIds()));
        }
        if (searchRequest.getPositionIds() != null && !searchRequest.getPositionIds().isEmpty()) {
            predicates.add(job.get("positionId").in(searchRequest.getPositionIds()));
        }
        if (searchRequest.getContractTypeIds() != null && !searchRequest.getContractTypeIds().isEmpty()) {
            predicates.add(job.get("contractTypeId").in(searchRequest.getContractTypeIds()));
        }
        if (searchRequest.getEducationIds() != null && !searchRequest.getEducationIds().isEmpty()) {
            predicates.add(job.get("educationLevelId").in(searchRequest.getEducationIds()));
        }

        query.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));

        // Sử dụng Pageable để lấy phân trang
        TypedQuery<Job> typedQuery = entityManager.createQuery(query);

        List<Job> jobEntities = typedQuery.getResultList();
        List<JobWithCompanyResponse> jobs = jobEntities.stream()
                .map(jobItem -> {
                    // Mapping job to JobWithCompanyResponse
                    String districtName = districtRepository.findById(jobItem.getDistrictId())
                            .map(District::getName)
                            .orElse("");
                    String cityName = cityRepository.findById(jobItem.getCityId())
                            .map(City::getName)
                            .orElse("");
                    String contractTypeName = contractTypeRepository.findById(jobItem.getContractTypeId())
                            .map(ContractType::getName)
                            .orElse("");
                    Employer employer = employerRepository.findById(jobItem.getEmployer()).orElse(null);
                    Company company = employer != null ? companyRepository.findById(employer.getCompany()).orElse(null) : null;

                    return JobWithCompanyResponse.builder()
                            .id(jobItem.getId())
                            .companyId(company.getId())
                            .title(jobItem.getTitle())
                            .location(jobItem.getLocation())
                            .district(districtName)
                            .city(cityName)
                            .contractType(contractTypeName)
                            .deadline(jobItem.getDeadline())
                            .createdAt(jobItem.getCreatedAt())
                            .companyName(company != null ? company.getCompanyName() : null)
                            .companyLogo(company != null ? company.getLogo() : null)
                            .companyDescription(company != null ? company.getDescription() : null)
                            .description(jobItem.getDescription())
                            .salary(jobItem.getSalary())
                            .build();
                })
                .collect(Collectors.toList());

        return ResponseBuilder.okResponse(
                languageService.getMessage("get.all.jobs.success"),
                jobs,
                StatusCodeEnum.JOB1001
        );
    }

}