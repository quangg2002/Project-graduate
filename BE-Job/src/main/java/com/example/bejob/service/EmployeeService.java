package com.example.bejob.service;

import com.example.bejob.dto.request.EmployeeSkillRequest;
import com.example.bejob.entity.Employee;
import com.example.bejob.entity.EmployeeSkill;
import com.example.bejob.entity.Skill;
import com.example.bejob.entity.User;
import com.example.bejob.repository.*;
import com.example.bejob.dto.EmployeeDto;
import com.example.bejob.dto.request.EmployeeRequest;
import com.example.bejob.dto.response.EmployeeResponse;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.security.service.AuthenticationService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {
    private final EmployeeSkillRepository employeeSkillRepository;
    private final SkillRepository skillRepository;
    @Value("${minio.url.public}")
    private String publicUrl;

    private final EmployeeRepository employeeRepository;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepo;
    private final FileService fileService;
    private final LanguageService languageService;
    private final ModelMapper modelMapper;

    public ResponseEntity<ResponseDto<Object>> createEmployee(EmployeeRequest employeeRequest) {
        try {
            String username = employeeRequest.getUsername();

            if (userRepository.existsByUsername(username)) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("auth.signup.user.exists"),
                        StatusCodeEnum.AUTH0019
                );
            }

            if (!employeeRequest.getPassword().equals(employeeRequest.getRetryPassword())) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("auth.signup.password.mismatch"),
                        StatusCodeEnum.AUTH0024
                );
            }

            User newUser = User.builder()
                    .email(employeeRequest.getEmail())
                    .username(employeeRequest.getUsername())
                    .password(passwordEncoder.encode(employeeRequest.getPassword()))
                    .role(roleRepo.findById(1L).get())
                    .build();

            User userSave = userRepository.save(newUser);

            Employee employee = new Employee();
            employee.setUserId(userSave.getId());

            employeeRepository.save(employee);

            EmployeeResponse employeeResponse = modelMapper.map(employee, EmployeeResponse.class);
            employeeResponse.setFullName(userSave.getFullName());
            employeeResponse.setAvatar(userSave.getAvatar());
            employeeResponse.setPhoneNumber(userSave.getPhoneNumber());

            return ResponseBuilder.okResponse(
                    languageService.getMessage("create.employee.success"),
                    employeeResponse,
                    StatusCodeEnum.EMPLOYEE1000
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("create.employee.failed"),
                    StatusCodeEnum.EMPLOYEE0000
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> getEmployee() {
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
            Employee employee = employeeRepository.findByUserId(user.getId());

            if (employee == null) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("employee.not.found"),
                        StatusCodeEnum.EMPLOYEE4000
                );
            }

            EmployeeResponse employeeResponse = modelMapper.map(employee, EmployeeResponse.class);
            employeeResponse.setEmail(user.getEmail());
            employeeResponse.setFullName(user.getFullName());
            employeeResponse.setAvatar(user.getAvatar());
            employeeResponse.setPhoneNumber(user.getPhoneNumber());

            return ResponseBuilder.okResponse(
                    languageService.getMessage("get.employee.success"),
                    employeeResponse,
                    StatusCodeEnum.EMPLOYEE1001
            );
        } catch (Exception e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("get.employee.failed"),
                    StatusCodeEnum.EMPLOYEE0001
            );
        }
    }

    public ResponseEntity<ResponseDto<Object>> updateEmployee(EmployeeDto employeeDto) {

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
            Employee employee = employeeRepository.findByUserId(user.getId());

            if (employee == null) {
                return ResponseBuilder.badRequestResponse(
                        languageService.getMessage("employee.not.found"),
                        StatusCodeEnum.EMPLOYEE4000
                );
            }
            if(employeeDto.getAvatar() ==null)
                modelMapper.map(employeeDto, employee);

            if (employeeDto.getAvatar() != null && !employeeDto.getAvatar().isEmpty()) {
                String avatar = fileService.uploadImageFile(employeeDto.getAvatar(), user.getAvatar(), "AVATAR");
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
            if(employeeDto.getAvatar() ==null) {
                user.setFullName(employeeDto.getFullName());
                user.setPhoneNumber(employeeDto.getPhoneNumber());
                userRepository.save(user);
            }

            employeeRepository.save(employee);

            EmployeeResponse employeeResponse = modelMapper.map(employee, EmployeeResponse.class);
            employeeResponse.setFullName(user.getFullName());
            employeeResponse.setAvatar(user.getAvatar());

            return ResponseBuilder.okResponse(
                    languageService.getMessage("update.employee.success"),
                    employeeResponse,
                    StatusCodeEnum.EMPLOYEE1002
            );
        } catch (RuntimeException e) {
            return ResponseBuilder.badRequestResponse(
                    languageService.getMessage("update.employee.failed"),
                    StatusCodeEnum.EMPLOYEE0002
            );
        }
    }

    @Transactional
    public ResponseEntity<ResponseDto<Object>> updateEmployeeSkills(EmployeeSkillRequest request) {

        List<Long> skillIds = request.getSkillIds();
        Long employeeId = authenticationService.getEmployeeFromContext();

        Employee employee = employeeRepository.findById(employeeId).get();

        if (employee == null) {
            return ResponseBuilder.okResponse(
                    languageService.getMessage("employee.not.found"),
                    StatusCodeEnum.EMPLOYEE4000
            );
        }
        // Xóa skills cũ
        employeeSkillRepository.deleteByEmployeeId(employee.getId());

        // Thêm skills mới
        if (skillIds != null && !skillIds.isEmpty()) {
            List<EmployeeSkill> employeeSkills = skillIds.stream()
                    .map(skillId -> EmployeeSkill.builder()
                            .employeeId(employee.getId())
                            .skillId(skillId)
                            .build())
                    .collect(Collectors.toList());

            employeeSkillRepository.saveAll(employeeSkills);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ResponseDto<List<Skill>>> getEmployeeSkills() {
        Long employeeId = authenticationService.getEmployeeFromContext();

        Employee employee = employeeRepository.findById(employeeId).orElse(null);

        if (employee == null) {
            return ResponseBuilder.okResponse(
                    languageService.getMessage("employee.not.found"),
                    StatusCodeEnum.EMPLOYEE4000
            );
        }

        // Get all employee_skill records for the employee
        List<EmployeeSkill> employeeSkills = employeeSkillRepository.findByEmployeeId(employee.getId());

        // Get all skill ids
        List<Long> skillIds = employeeSkills.stream()
                .map(EmployeeSkill::getSkillId)
                .collect(Collectors.toList());

        // Fetch all skills and convert to DTOs
        List<Skill> skills = skillRepository.findAllById(skillIds)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseBuilder.okResponse(
                languageService.getMessage("get.skills.success"),
                skills,
                StatusCodeEnum.SKILL0000
        );
    }

    private Skill convertToDTO(Skill skill) {
        return Skill.builder()
                .id(skill.getId())
                .name(skill.getName())
                .build();
    }
}
