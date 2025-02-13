package com.example.bejob.repository;

import com.example.bejob.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    boolean existsByCompanyName(String name);

    <Optional> Company findByCompanyName(String name);

    Optional<Company> findByEmployerId(Long employerId);

    Optional<Company> findById(Long id);
}
