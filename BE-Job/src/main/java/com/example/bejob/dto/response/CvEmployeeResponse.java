package com.example.bejob.dto.response;

import com.example.bejob.entity.Certificate;
import com.example.bejob.entity.Education;
import com.example.bejob.entity.Hobby;
import com.example.bejob.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CvEmployeeResponse {
    private String nameCv;
    private String name;
    private String position;
    private String phone;
    private String email;
    private String address;
    private String dob;
    private String avatar;
    private String target;
    private List<Education> educations;
    private List<Certificate> certificates;
    private List<Hobby> hobbies;
    private List<Project> projects;
}
