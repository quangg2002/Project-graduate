package com.example.bejob.dto.request;

import com.example.bejob.annotation.IsValidImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerUpdateRequest {
    private Long company;
    private String fullName;
    private String email;
    private String gender;
    private String phoneNumber;
    private String address;
    @IsValidImage(maxSize = 10 * 1024 * 1024)
    private MultipartFile avatar;
}
