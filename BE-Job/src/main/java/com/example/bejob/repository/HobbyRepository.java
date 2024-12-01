package com.example.bejob.repository;

import com.example.bejob.entity.Hobby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HobbyRepository extends JpaRepository<Hobby, Long> {
    List<Hobby> findByCvId(Long cvId);

    List<Hobby> findByCvIdAndEmployeeId(Long cvId, Long employeeId);

    void deleteByCvIdAndEmployeeId(Long cvId, Long employeeId);
}