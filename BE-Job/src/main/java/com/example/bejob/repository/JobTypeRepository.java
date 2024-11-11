package com.example.bejob.repository;

import com.example.bejob.entity.JobType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobTypeRepository extends JpaRepository<JobType, Long> {
}