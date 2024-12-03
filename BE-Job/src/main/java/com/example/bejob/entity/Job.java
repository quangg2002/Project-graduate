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

    @Column(columnDefinition = "VARCHAR(5000)")
    private String title;

    @Column(columnDefinition = "VARCHAR(5000)")
    private String description;

    @Column(columnDefinition = "VARCHAR(5000)")
    private String benefit;

    @Column(columnDefinition = "VARCHAR(5000)")
    private String requirement;

    @Column(columnDefinition = "VARCHAR(5000)")
    private String location;

    @Column(columnDefinition = "VARCHAR(5000)")
    private String workingTime;

    private Long cityId;

    private Long districtId;

    private String salary;

    private Long yearExperience;

    private Long positionId;

    private Long jobTypeId;

    private Long contractTypeId;

    private Long industryId;

    private Long educationLevelId;

    private String deadline;

    private Long quantity;

    private Boolean active;
}