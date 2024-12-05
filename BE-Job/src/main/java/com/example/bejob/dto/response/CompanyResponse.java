package com.example.bejob.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CompanyResponse {
    private String companyName;
    private String description;
    private String website;
    private String logo;
    private String address;
    private String city;
    private String district;
    private String scale;
}
