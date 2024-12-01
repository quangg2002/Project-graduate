package com.example.bejob.entity;

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
@Table(name = "project")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cvId;

    private Long employeeId;

    private String name;

    private String startDate;

    private String endDate;

    private String quantity;

    private String github;

    @Column(columnDefinition = "TEXT")
    private  String description;
}
