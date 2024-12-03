package com.example.bejob.service;

import com.example.bejob.dto.UserInfoDto;
import com.example.bejob.model.ResponseDto;
import org.springframework.http.ResponseEntity;

public interface UserInfoService {
    ResponseEntity<ResponseDto<UserInfoDto>> getUserInfoById(Long userId);
}