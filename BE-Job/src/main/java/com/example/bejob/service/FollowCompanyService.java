package com.example.bejob.service;

import com.example.bejob.entity.*;
import com.example.bejob.repository.*;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowCompanyService {

    private final LanguageService languageService;
    private final AuthenticationService authenticationService;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final FollowCompanyRepository followCompanyRepository;

    public ResponseEntity<ResponseDto<Object>> followCompany(Long companyId) {
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

        Optional<FollowCompany> existingFollowCompany = followCompanyRepository.findByEmployeeIdAndCompanyId(employee.getId(), companyId);
        if (existingFollowCompany.isPresent()) {
            try {
                followCompanyRepository.deleteById(existingFollowCompany.get().getId());
                return ResponseBuilder.okResponse(
                        languageService.getMessage("delete.follow.company.success"),
                        StatusCodeEnum.FOLLOW1003
                );
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("delete.follow.company.failed"),
                        StatusCodeEnum.FOLLOW0003
                );
            }
        }

        FollowCompany followCompany = FollowCompany.builder()
                .companyId(companyId)
                .employeeId(employee.getId())
                .build();

        try {
            followCompanyRepository.save(followCompany);
            return ResponseBuilder.okResponse(
                    languageService.getMessage("create.follow.company.success"),
                    followCompany,
                    StatusCodeEnum.FOLLOW1000
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("create.follow.company.failed"),
                    StatusCodeEnum.FOLLOW0000
            );
        }
    }


    public ResponseEntity<ResponseDto<Object>> getFollowCompany() {
        Long employeeId = authenticationService.getEmployeeFromContext();

        System.out.println("employeeId: " + employeeId);

        Employee employee = employeeRepository.findById(employeeId).orElse(null);

        if (employee == null) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employee.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        try {
            List<FollowCompany> followCompanyList = followCompanyRepository.findAllByEmployeeId(employee.getId());

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.follow.company.success"),
                    followCompanyList,
                    StatusCodeEnum.FOLLOW1002
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.follow.company.failed"),
                    StatusCodeEnum.FOLLOW0002
            );
        }
    }

    public List<FollowCompany> getListFollow() {
        try {
            Long employeeId = authenticationService.getEmployeeFromContext();

            Employee employee = employeeRepository.findById(employeeId).orElse(null);

            return followCompanyRepository.findAllByEmployeeId(employee.getId());
        } catch (Exception e) {

            System.err.println("Error while fetching follow company list: " + e.getMessage());
            e.printStackTrace();

            return new ArrayList<>();
        }
    }
}