package com.example.bejob.service;

import com.example.bejob.dto.response.CompanyDetailsResponse;
import com.example.bejob.dto.response.CompanyResponse;
import com.example.bejob.dto.response.JobCompanyDetailsResponse;
import com.example.bejob.entity.*;
import com.example.bejob.repository.*;
import com.example.bejob.dto.request.CompanyRequest;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.web.mappings.MappingsEndpoint;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyService {

    private final FileService fileService;
    private final DistrictRepository districtRepository;
    private final MappingsEndpoint mappingsEndpoint;
    private final CityRepository cityRepository;
    private final ScaleRepository scaleRepository;
    private final JobRepository jobRepository;
    @Value("${minio.url.public}")
    private String publicUrl;

    private final CompanyRepository companyRepository;
    private final LanguageService languageService;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final EmployerRepository employerRepository;
    private final ModelMapper modelMapper;

    public ResponseEntity<ResponseDto<Object>> getCompany() {

        String userName = authenticationService.getUserFromContext();

        System.out.println("userName: " + userName);

        Optional<User> user = userRepository.findByUsername(userName);

        if (user.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("auth.signup.user.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        Employer employer = employerRepository.findByUserId(user.get().getId());

        if (employer == null) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employer.not.found"),
                    StatusCodeEnum.EMPLOYEE4000
            );
        }

        try {
            Optional<Company> company = companyRepository.findById(employer.getCompany());

            CompanyResponse companyResponse = CompanyResponse.builder()
                    .logo(company.get().getLogo())
                    .companyName(company.get().getCompanyName())
                    .website(company.get().getWebsite())
                    .address(company.get().getAddress())
                    .description(company.get().getDescription())
                    .district(districtRepository.findById(company.get().getDistrict())
                            .map(District::getName)
                            .orElse(null)
                    )
                    .city(cityRepository.findById(company.get().getCity())
                            .map(City::getName)
                            .orElse(null)
                    )
                    .scale(scaleRepository.findById(company.get().getScale())
                            .map(Scale::getName)
                            .orElse(null)
                    )
                    .build();

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.company.success"),
                    companyResponse,
                    StatusCodeEnum.COMPANY1001
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.company.failed"),
                    StatusCodeEnum.COMPANY0001
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> updateCompany(CompanyRequest companyRequest) {
        String userName = authenticationService.getUserFromContext();

        Optional<User> userOpt = userRepository.findByUsername(userName);

        if (userOpt.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("auth.signup.user.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        User user = userOpt.get();
        Employer employer = employerRepository.findByUserId(user.getId());

        if (employer == null) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employer.not.found"),
                    StatusCodeEnum.EMPLOYEE4000
            );
        }

        Optional<Company> companyOpt = companyRepository.findById(employer.getCompany());
        System.out.println(companyOpt);
        if (companyOpt.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("company.not.found"),
                    StatusCodeEnum.COMPANY0002
            );
        }

        Company company = companyOpt.get();
        String avt = companyOpt.get().getLogo();

        try {
            modelMapper.map(companyRequest, company);
            company.setEmployerId(employer.getId());
            if (companyRequest.getLogo() != null && !companyRequest.getLogo().isEmpty()) {
                String logo = fileService.uploadImageFile(companyRequest.getLogo(), company.getLogo(), "LOGO");
                if (logo == null) {
                    log.error("Upload file image avatar failed");
                    return ResponseBuilder.badRequestResponse(
                            languageService.getMessage("upload.file.avatar.failed"),
                            StatusCodeEnum.UPLOADFILE0001
                    );
                } else {
                    company.setLogo(publicUrl + "/" + logo);
                }
            }
            else {
                company.setLogo(avt);
            }

            companyRepository.save(company);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("update.company.success"),
                    company,
                    StatusCodeEnum.COMPANY1002
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("update.company.failed"),
                    StatusCodeEnum.COMPANY0003
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getAllCompanies() {
        try {
            List<Company> companies = companyRepository.findAll();

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.company.success"),
                    companies,
                    StatusCodeEnum.COMPANY1001
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.company.failed"),
                    StatusCodeEnum.COMPANY0001
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getDetailsCompany(Long companyId) {
        try {

            Company company = companyRepository.findById(companyId).get();

            List<Employer> employers = employerRepository.findByCompany(companyId);

            List<Job> jobs = new ArrayList<>();

            for (Employer employer : employers) {
                List<Job> employerJobs = jobRepository.findByEmployer(employer.getId());
                jobs.addAll(employerJobs);
            }

            List<JobCompanyDetailsResponse> lists = jobs.stream()
                    .map(job -> JobCompanyDetailsResponse.builder()
                            .jobId(job.getId())
                            .jobDeadline(job.getDeadline())
                            .jobSalary(job.getSalary())
                            .jobTitle(job.getTitle())
                            .jobCity(cityRepository.findById(job.getCityId())
                                    .map(City :: getName)
                                    .orElse(null)
                            )
                            .build()
                    )
                    .collect(Collectors.toList());

            CompanyResponse companyResponse = CompanyResponse.builder()
                    .logo(company.getLogo())
                    .companyName(company.getCompanyName())
                    .website(company.getWebsite())
                    .address(company.getAddress())
                    .description(company.getDescription())
                    .scale(scaleRepository.findById(company.getScale())
                            .map(Scale :: getName)
                            .orElse(null)
                    )
                    .city(cityRepository.findById(company.getCity())
                            .map(City :: getName)
                            .orElse(null)
                    )
                    .district(districtRepository.findById(company.getDistrict())
                            .map(District :: getName)
                            .orElse(null)
                    )
                    .build();

            CompanyDetailsResponse companyDetailsResponse = CompanyDetailsResponse.builder()
                    .companyResponse(companyResponse)
                    .listJob(lists)
                    .build();

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.company.success"),
                    companyDetailsResponse,
                    StatusCodeEnum.COMPANY1001
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.company.failed"),
                    StatusCodeEnum.COMPANY0001
            );
        }
    }
}