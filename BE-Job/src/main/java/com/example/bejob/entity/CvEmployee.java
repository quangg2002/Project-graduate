package com.example.bejob.entity;

import com.example.bejob.base.Auditable;
import com.example.bejob.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "cv")
public class CvEmployee extends Auditable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameEmployee;

    private String positionWork;

    private String phoneEmployee;

    private String emailEmployee;

    private String addressEmployee;

    private String dobEmployee;

    private String avata;
}
