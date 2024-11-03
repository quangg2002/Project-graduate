package com.example.bejob.security.until;
import com.example.bejob.containts.FileConstant;
import lombok.experimental.UtilityClass;

@UtilityClass
public class Util {
    public boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    public String generateFileDirectory(String... arg) {
        return String.join(FileConstant.DIRECTORY_DIVIDE, arg);
    }
}
