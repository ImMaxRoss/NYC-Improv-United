package com.backend.repository;

import com.backend.model.EvaluationTemplate;
import com.backend.model.Exercise;
import com.backend.model.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationTemplateRepository extends JpaRepository<EvaluationTemplate, Long> {
    
    Optional<EvaluationTemplate> findByIsDefaultTrue();
    
    // Find all templates for an exercise
    List<EvaluationTemplate> findByExercise(Exercise exercise);
    
    // Find templates created by a coach
    List<EvaluationTemplate> findByCreatedByOrderByNameAsc(Coach coach);
    
    // Find template by ID and coach (for security)
    Optional<EvaluationTemplate> findByIdAndCreatedBy(Long id, Coach coach);
    
    // Find templates accessible to a coach (their own + system defaults)
    @Query("SELECT et FROM EvaluationTemplate et WHERE et.createdBy = :coach OR et.createdBy IS NULL")
    List<EvaluationTemplate> findAccessibleTemplates(@Param("coach") Coach coach);
    
    // Find default system templates (no creator)
    List<EvaluationTemplate> findByCreatedByIsNullOrderByNameAsc();
    
    // Find templates by name (case-insensitive)
    @Query("SELECT et FROM EvaluationTemplate et WHERE LOWER(et.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<EvaluationTemplate> findByNameContainingIgnoreCase(@Param("name") String name);
    
    // Count templates by coach
    Long countByCreatedBy(Coach coach);
    
    // Find templates used in lessons
    @Query("SELECT DISTINCT et FROM EvaluationTemplate et JOIN LessonExercise le ON le.evaluationTemplate = et")
    List<EvaluationTemplate> findTemplatesInUse();
    
    // Find most used templates
    @Query("SELECT et, COUNT(le) as usageCount FROM EvaluationTemplate et " +
           "LEFT JOIN LessonExercise le ON le.evaluationTemplate = et " +
           "WHERE et.createdBy = :coach OR et.createdBy IS NULL " +
           "GROUP BY et ORDER BY usageCount DESC")
    List<Object[]> findMostUsedTemplates(@Param("coach") Coach coach);
}