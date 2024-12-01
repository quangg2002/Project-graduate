package com.example.bejob.service;

import com.example.bejob.entity.Skill;
import com.example.bejob.repository.SkillRepository;
import com.example.bejob.dto.request.SkillRequest;
import com.example.bejob.dto.response.SkillResponse;
import com.example.bejob.enums.StatusCodeEnum;
import com.example.bejob.model.ResponseBuilder;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.security.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SkillService {

}
