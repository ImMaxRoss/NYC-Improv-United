package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.model.ExerciseEvaluation;

@Repository
public interface ExerciseEvaluationRepository extends JpaRepository<ExerciseEvaluation, Long> {
    List<ExerciseEvaluation> findByPracticeSessionId(Long sessionId);
    List<ExerciseEvaluation> findByLessonExerciseId(Long lessonExerciseId);
    
    @Query("SELECT e FROM ExerciseEvaluation e JOIN e.evaluatedPerformers p WHERE p.id = :performerId")
    List<ExerciseEvaluation> findByPerformerId(@Param("performerId") Long performerId);
}