package com.example.bejob.service.impl;

import com.example.bejob.dto.UserInfoDto;
import com.example.bejob.entity.User;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.repository.UserRepository;
import com.example.bejob.service.LanguageService;
import com.example.bejob.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserInfoServiceImpl implements UserInfoService {

    private final UserRepository userRepository;
    private final LanguageService languageService;

    public ResponseEntity<ResponseDto<UserInfoDto>> getUserInfoById(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseBuilder.noContentResponse(
                    "not-found",
                    StatusCodeEnum.USERINFO0000);
        }
        UserInfoDto userInfoDto = UserInfoDto.builder()
                .fullName(user.getFullName())
                .userId(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .build();
        return ResponseBuilder.okResponse(
                "success",
                userInfoDto,
                StatusCodeEnum.USERINFO1000
        );
    }
}

