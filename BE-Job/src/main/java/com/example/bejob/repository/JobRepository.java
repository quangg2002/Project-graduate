package com.example.bejob.repository;

import com.example.bejob.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findAllByEmployer(Long employerId);

    List<Job> findByEmployer(Long employerId);
}
