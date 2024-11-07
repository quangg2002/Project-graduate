package com.example.bejob.repository;

import com.example.bejob.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Long> {
    Employer findByUserId(Long userId);
}