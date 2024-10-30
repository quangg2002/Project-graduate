package com.example.bejob.controller;

import com.example.bejob.service.CvService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
