package com.example.bejob.repository;

import com.example.bejob.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findAllByEmployeeId(Long id);

    List<Education> findByCvIdAndEmployeeId(Long cvId, Long employeeId);

    void deleteByCvIdAndEmployeeId(Long cvId, Long employeeId);
}