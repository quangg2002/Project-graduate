package com.example.bejob.service;

import com.example.bejob.entity.Experience;
import com.example.bejob.repository.ExperienceRepository;
import com.example.bejob.dto.request.ExperienceRequest;
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

@Service
@Slf4j
@RequiredArgsConstructor
public class ExperienceService {

    private final ModelMapper modelMapper;
    private final ExperienceRepository experienceRepository;
    private final LanguageService languageService;
    private final AuthenticationService authenticationService;

    public ResponseEntity<ResponseDto<Object>> createExperience(ExperienceRequest experienceRequest) {
        Long employeeId = authenticationService.getEmployeeFromContext();

        if (employeeId == null) {
            log.error("EmployeeId is null");
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employee.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        try {
            Experience experience = modelMapper.map(experienceRequest, Experience.class);
            experience.setEmployeeId(employeeId);

            experienceRepository.save(experience);
            return ResponseBuilder.okResponse(
                    languageService.getMessage("create.experience.success"),
                    experience,
                    StatusCodeEnum.EXPERIENCE1000
            );
        } catch (
                RuntimeException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("create.experience.failed"),
                    StatusCodeEnum.EXPERIENCE0000
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> updateExperience(Long id, ExperienceRequest experienceRequest) {
        try {
            Experience experience = experienceRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException(languageService.getMessage("not.found.experience")));

            if (experienceRequest != null) {
                modelMapper.map(experienceRequest, experience);
            }

            experienceRepository.save(experience);

            return ResponseBuilder.okResponse(
                    languageService.getMessage("update.experience.success"),
                    experience,
                    StatusCodeEnum.EXPERIENCE1001
            );
        } catch (NoSuchElementException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("not.found.experience"),
                    StatusCodeEnum.EXPERIENCE4000
            );
        } catch (RuntimeException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("update.experience.failed"),
                    StatusCodeEnum.EXPERIENCE0001
            );
        }
    }


    public ResponseEntity<ResponseDto<List<Experience>>> getExperience() {

        Long employeeId = authenticationService.getEmployeeFromContext();

        if (employeeId == null) {
            log.error("EmployeeId is null");
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("employee.not.found"),
                    StatusCodeEnum.AUTH0016
            );
        }

        try {
            List<Experience> experience = experienceRepository.findAllByEmployeeId(employeeId);
            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.experience.success"),
                    experience,
                    StatusCodeEnum.EXPERIENCE1002
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.experience.failed"),
                    StatusCodeEnum.EXPERIENCE1002
            );
        }
    }

    public ResponseEntity<ResponseDto<Experience>> getExperienceById(Long id) {

        try {
            Experience experience = experienceRepository.findById(id).orElseThrow();

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.experience.success"),
                    experience,
                    StatusCodeEnum.EXPERIENCE1002
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.experience.failed"),
                    StatusCodeEnum.EXPERIENCE1002
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> deleteExperience(Long id) {
        try {
            experienceRepository.deleteById(id);
            return ResponseBuilder.okResponse(
                    languageService.getMessage("delete.experience.success"),
                    StatusCodeEnum.EXPERIENCE1003
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("delete.experience.failed"),
                    StatusCodeEnum.EXPERIENCE1003
            );
        }
    }
}