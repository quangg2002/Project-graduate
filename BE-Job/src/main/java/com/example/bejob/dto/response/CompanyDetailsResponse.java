package com.example.bejob.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CompanyDetailsResponse {
    private CompanyResponse companyResponse;
    private List<JobCompanyDetailsResponse> listJob;
}
