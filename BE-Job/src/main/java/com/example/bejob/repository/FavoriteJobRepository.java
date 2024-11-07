package com.example.bejob.repository;

import com.example.bejob.entity.FavoriteJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteJobRepository extends JpaRepository<FavoriteJob, Long> {
    List<FavoriteJob> findByUserId(Long userId);

    Optional<FavoriteJob> findByUserIdAndJobId(Long userId, Long jobId);
}
