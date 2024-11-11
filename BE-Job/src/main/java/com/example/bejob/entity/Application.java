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
@Table(name = "applications")
public class Application extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;

    private Long employeeId;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private String coverLetter;

    private String cvPdf;
}