package com.example.bejob.controller;

import com.example.bejob.dto.request.CompanyRequest;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/company")
public class CompanyController {
    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<ResponseDto<Object>> getCompany() {
        return companyService.getCompany();
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<ResponseDto<Object>> getCompanyDetails(@PathVariable Long companyId) {
        return companyService.getDetailsCompany(companyId);
    }

    @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDto<Object>> updateCompany(@ModelAttribute @Valid CompanyRequest companyRequest) {
        return companyService.updateCompany(companyRequest);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseDto<Object>> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    @GetMapping("/board")
    public ResponseEntity<ResponseDto<Object>> getBoardCompanies() {
        return companyService.getDetailsCompanyBoard();
    }
}
