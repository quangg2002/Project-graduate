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
    private String title;
    private String description;
    private String requirements;
    private String location;

    private Long yearExperience;

    private Long salary;

    private Long tech;

    private Long city;

    private Long district;

    private Long position;

    private Long jobType;

    private Long contractType;

    // han nop ho so
    private String deadline;

    @Enumerated(EnumType.STRING)
    private JobStatus status;
}