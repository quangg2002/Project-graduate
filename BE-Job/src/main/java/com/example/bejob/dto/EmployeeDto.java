package com.example.bejob.dto;

import com.example.bejob.annotation.IsValidImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private String email;
    private String fullName;
    private String phoneNumber;
    private String gender;
    private String dateOfBirth;
    private String address;
    @IsValidImage(maxSize = 10 * 1024 * 1024)
    private MultipartFile avatar;
    private String career;
}