package com.example.bejob.repository;

import com.example.bejob.entity.NotificationPattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPatternRepository extends JpaRepository<NotificationPattern, Long> {
    Optional<NotificationPattern> findByType(String type);
}