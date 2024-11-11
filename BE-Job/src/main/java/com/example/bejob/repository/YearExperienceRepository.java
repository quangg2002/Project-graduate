package com.example.bejob.repository;

import com.example.bejob.entity.YearExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YearExperienceRepository extends JpaRepository<YearExperience, Long> {
}
