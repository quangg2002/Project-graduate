package com.example.bejob.repository;

import com.example.bejob.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCompanyId(Long companyId);
    List<Application> findByEmployeeId(Long employeeId);
    List<Application> findByJobId(Long jobId);
    boolean existsByEmployeeIdAndJobId(Long employeeId, Long jobId);
}