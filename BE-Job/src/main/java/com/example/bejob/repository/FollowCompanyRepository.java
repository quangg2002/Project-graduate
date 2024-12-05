package com.example.bejob.repository;

import com.example.bejob.entity.FavoriteJob;
import com.example.bejob.entity.FollowCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowCompanyRepository extends JpaRepository<FollowCompany, Long> {
    List<FollowCompany> findAllByEmployeeId(Long id);

    void deleteByEmployeeIdAndCompanyId(Long id, Long companyId);

    Optional<FollowCompany> findByEmployeeIdAndCompanyId(Long employeeId, Long companyId);
}
