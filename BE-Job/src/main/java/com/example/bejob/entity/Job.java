package com.example.bejob.entity;

import com.example.bejob.base.Auditable;
import com.example.bejob.enums.JobStatus;
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
@Table(name = "jobs")
public class Job extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long employer;

    @Column(columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String benefit;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String location;

    private Long yearExperience;

    private Long cityId;

    private Long districtId;

    private Long positionId;

    private Long jobTypeId;

    private Long contractTypeId;

    private Long industryId;

    private Long educationLevelId;

    private String deadline;

    @Column(columnDefinition = "TEXT")
    private String workingTime;

    private String quantity;

    @Enumerated(EnumType.STRING)
    private JobStatus status;
}