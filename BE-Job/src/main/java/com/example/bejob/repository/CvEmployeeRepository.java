package com.example.bejob.repository;

import com.example.bejob.entity.CvEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CvEmployeeRepository extends JpaRepository<CvEmployee, Long> {
    Optional<CvEmployee> findByCvIdAndEmployeeId(Long cvId, Long employeeId);

    Optional<CvEmployee> findByCvId(Long cvId);
}
