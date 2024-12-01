package com.example.bejob.repository;

import com.example.bejob.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByCvId(Long cvId);

    List<Certificate> findByCvIdAndEmployeeId(Long cvId, Long employeeId);

    void deleteByCvIdAndEmployeeId(Long cvId, Long employeeId);
}
