package com.example.bejob.repository;

import com.example.bejob.entity.EmployeeSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeSkillRepository extends JpaRepository<EmployeeSkill, Long> {
    List<EmployeeSkill> findByEmployeeId(Long employeeId);

    List<EmployeeSkill> findAllByEmployeeId(Long employeeId);

    void deleteByEmployeeId(Long employeeId);
}
