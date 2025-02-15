package com.example.bejob.service;

import com.example.bejob.entity.Company;
import com.example.bejob.entity.Employer;
import com.example.bejob.entity.User;
import com.example.bejob.repository.CompanyRepository;
import com.example.bejob.repository.EmployerRepository;
import com.example.bejob.repository.RoleRepository;
import com.example.bejob.repository.UserRepository;
import com.example.bejob.dto.request.EmployerRequest;
import com.example.bejob.dto.request.EmployerUpdateRequest;
import com.example.bejob.dto.response.EmployerResponse;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployerService {
    @Value("${minio.url.public}")
    private String publicUrl;

    private final EmployerRepository employerRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepo;
    private final CompanyRepository companyRepository;
    private final LanguageService languageService;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final FileService fileService;
    private final AuthenticationService authenticationService;

    public ResponseEntity<ResponseDto<Object>> createEmployer(EmployerRequest employerRequest) {
        try {

            String email = employerRequest.getEmail();

            if (userRepository.existsByEmail(email)) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("auth.signup.email.exists"),
                        StatusCodeEnum.AUTH0019
                );
            }

            if (!employerRequest.getPassword().equals(employerRequest.getRetryPassword())) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("auth.signup.password.mismatch"),
                        StatusCodeEnum.AUTH0024
                );
            }

            User newUser = User.builder()
                    .email(employerRequest.getEmail())
                    .username(employerRequest.getUsername())
                    .password(passwordEncoder.encode(employerRequest.getPassword()))
                    .role(roleRepo.findById(2L).get())
                    .phoneNumber(employerRequest.getPhoneNumber())
                    .fullName(employerRequest.getFullName())
                    .build();

            User userSave = userRepository.save(newUser);

            Long companyId;

            Company company = new Company();
            companyRepository.save(company);
            companyId = company.getId();

            Employer employer = new Employer();
            employer.setUserId(userSave.getId());
            employer.setCompany(companyId);
            employer.setEmail(employerRequest.getEmail());

            employerRepository.save(employer);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("create.employer.success"),
                    employer,
                    StatusCodeEnum.EMPLOYER1000
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("create.employer.failed"),
                    StatusCodeEnum.EMPLOYER0000
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getEmployer() {
        String userName = authenticationService.getUserFromContext();

        Optional<User> userOptional = userRepository.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("auth.signup.user.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        User user = userOptional.get();

        try {
            Employer employer = employerRepository.findByUserId(user.getId());

            if (employer == null) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("employer.not.found"),
                        StatusCodeEnum.EMPLOYEE4000
                );
            }

            Company company = companyRepository.findById(employer.getCompany()).get();

            EmployerResponse employerResponse = modelMapper.map(employer, EmployerResponse.class);
            employerResponse.setCompany(company);
            employerResponse.setAvatar(user.getAvatar());
            employerResponse.setFullName(user.getFullName());
            employerResponse.setPhoneNumber(user.getPhoneNumber());

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.employer.success"),
                    employerResponse,
                    StatusCodeEnum.EMPLOYEE1001
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.employer.failed"),
                    StatusCodeEnum.EMPLOYEE0001
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> updateEmployer(EmployerUpdateRequest employerUpdateRequest) {

        String userName = authenticationService.getUserFromContext();

        Optional<User> userOptional = userRepository.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("auth.signup.user.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        User user = userOptional.get();

        Employer employer = employerRepository.findByUserId(user.getId());

        if (employer == null) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employer.not.found"),
                    StatusCodeEnum.EMPLOYER4000
            );
        }

        try {
            modelMapper.map(employerUpdateRequest, employer);

            if (employerUpdateRequest.getAvatar() != null && !employerUpdateRequest.getAvatar().isEmpty()) {
                String avatar = fileService.uploadImageFile(employerUpdateRequest.getAvatar(), user.getAvatar(), "AVATAR");
                if (avatar == null) {
                    log.error("Upload file image avatar failed");
                    return ResponseBuilder.badRequestResponse(
                            languageService.getMessage("upload.file.avatar.failed"),
                            StatusCodeEnum.UPLOADFILE0001
                    );
                } else {
                    user.setAvatar(publicUrl + "/" + avatar);
                }
            }
            user.setFullName(employerUpdateRequest.getFullName());
            user.setPhoneNumber(employerUpdateRequest.getPhoneNumber());

            userRepository.save(user);

            employerRepository.save(employer);

            Company company = companyRepository.findById(employer.getCompany()).get();

            EmployerResponse employerResponse = modelMapper.map(employer, EmployerResponse.class);
            employerResponse.setCompany(company);
            employerResponse.setAvatar(user.getAvatar());
            employerResponse.setFullName(user.getFullName());
            employerResponse.setPhoneNumber(user.getPhoneNumber());

            return ResponseBuilder.okResponse(
                    languageService.getMessage("update.employer.success"),
                    employerResponse,
                    StatusCodeEnum.EMPLOYER1002
            );

        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("update.employer.failed"),
                    StatusCodeEnum.EMPLOYER0002
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> updateCompanyEmployer(Long idCompany) {
        String userName = authenticationService.getUserFromContext();

        Optional<User> userOptional = userRepository.findByUsername(userName);

        if (userOptional.isEmpty()) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("auth.signup.user.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        User user = userOptional.get();

        Employer employer = employerRepository.findByUserId(user.getId());

        if (employer == null) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employer.not.found"),
                    StatusCodeEnum.EMPLOYER4000
            );
        }

        try {
            employer.setCompany(idCompany);
            employerRepository.save(employer);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("update.employer.success"),
                    employer,
                    StatusCodeEnum.EMPLOYER1002
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("update.employer.failed"),
                    StatusCodeEnum.EMPLOYER0002
            );
        }
    }
}
