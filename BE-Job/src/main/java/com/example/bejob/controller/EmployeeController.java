package com.example.bejob.controller;

import com.example.bejob.dto.EmployeeDto;
import com.example.bejob.dto.request.EmployeeRequest;
import com.example.bejob.dto.request.EmployeeSkillRequest;
import com.example.bejob.entity.Skill;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping("/create")
    public ResponseEntity<ResponseDto<Object>> createEmployee(@Valid @RequestBody EmployeeRequest employee) {
        return employeeService.createEmployee(employee);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<Object>> getEmployee() {
        return employeeService.getEmployee();
    }

    @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDto<Object>> updateEmployee(@Valid @ModelAttribute EmployeeDto employeeDTO) {
        return employeeService.updateEmployee(employeeDTO);
    }

    @PutMapping("/skill")
    public ResponseEntity<ResponseDto<Object>> updateSkills(@RequestBody EmployeeSkillRequest request) {
        return employeeService.updateEmployeeSkills(request);
    }

    @GetMapping("/skills")
    public ResponseEntity<ResponseDto<List<Skill>>> getEmployeeSkills() {
        return employeeService.getEmployeeSkills();
    }
}