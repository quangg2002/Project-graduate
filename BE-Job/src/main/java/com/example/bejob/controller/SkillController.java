package com.example.bejob.controller;

import com.example.bejob.dto.request.SkillRequest;
import com.example.bejob.dto.response.SkillResponse;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/skill")
public class SkillController {

}