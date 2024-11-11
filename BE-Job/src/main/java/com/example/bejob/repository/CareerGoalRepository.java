package com.example.bejob.repository;

import com.example.bejob.entity.CareerGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerGoalRepository extends JpaRepository<CareerGoal, Long> {
    CareerGoal findByEmployeeId(Long id);
}
