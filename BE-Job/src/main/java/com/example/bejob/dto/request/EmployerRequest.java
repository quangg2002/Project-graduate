package com.example.bejob.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerRequest {
    private String username;
    private String email;
    private String password;
    private String retryPassword;
    private String fullName;
    private String gender;
    private String phoneNumber;
    private Long companyId;
    private String nameCompany;
    private Long city;
    private Long district;
}
