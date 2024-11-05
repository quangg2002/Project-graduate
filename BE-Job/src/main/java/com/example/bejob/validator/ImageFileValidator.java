package com.example.bejob.validator;

import com.example.bejob.annotation.IsValidImage;
import com.example.bejob.util.FileUtil;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

public class ImageFileValidator implements ConstraintValidator<IsValidImage, MultipartFile> {

    private long maxSize;

    @Override
    public void initialize(IsValidImage imageFile) {
        this.maxSize = imageFile.maxSize();
    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        return FileUtil.validImageFile(file, maxSize, context);
    }
}