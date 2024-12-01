package com.example.bejob.repository;

import com.example.bejob.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCvId(Long cvId);

    List<Project> findByCvIdAndEmployeeId(Long cvId, Long employeeId);

    void deleteByCvIdAndEmployeeId(Long cvId, Long employeeId);
}
