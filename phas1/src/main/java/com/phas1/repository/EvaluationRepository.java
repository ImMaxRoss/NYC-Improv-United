package com.phas1.repository;

import com.phas1.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByTeam_TeamId(Long teamId);
    
    // Find evaluations by team IDs
    List<Evaluation> findByTeam_TeamIdIn(List<Long> teamIds);

    List<Evaluation> findByTeam_TeamIdAndPerformanceDateBetween(
            Long teamId, LocalDateTime startDate, LocalDateTime endDate);
            
    List<Evaluation> findByTeam_TeamIdAndPerformanceDateAfter(
            Long teamId, LocalDateTime startDate);
            
    List<Evaluation> findByTeam_TeamIdAndPerformanceDateBefore(
            Long teamId, LocalDateTime endDate);

}