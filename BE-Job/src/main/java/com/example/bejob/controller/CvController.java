package com.example.bejob.controller;

import com.example.bejob.dto.request.CvRequest;
import com.example.bejob.dto.response.CvEmployeeResponse;
import com.example.bejob.model.ResponseDto;
import com.example.bejob.service.CvService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Cv")
@RequiredArgsConstructor
@RestController
@RequestMapping("/public/cv")
public class CvController {

    private final CvService cvService;

    @GetMapping("/gen")
    public ResponseEntity<ByteArrayResource> gen(@RequestParam String layout) {
        byte[] cv = new byte[0];
        cv = cvService.generateCv(layout);
        ByteArrayResource resource = new ByteArrayResource(cv);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @PostMapping("/update")
    public ResponseEntity<ResponseDto<Object>> updateCv(@RequestBody CvRequest cvRequest) {
        return cvService.updateCv(cvRequest);
    }

    @PatchMapping(value = "/update-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDto<Object>> updateAvataCv(@RequestParam(value = "avatar", required = false) MultipartFile avatar, @RequestParam(value = "layout") Long idCv) {
        return cvService.updateAvtCv(avatar, idCv);
    }

    @GetMapping
    public CvEmployeeResponse getCv(@RequestParam String layout){
        return cvService.getCv(Long.valueOf(layout));
    }

    @GetMapping("/list-cv")
    public ResponseEntity<ResponseDto<Object>> getListCv(){
        return cvService.getListCv();
    }
}
