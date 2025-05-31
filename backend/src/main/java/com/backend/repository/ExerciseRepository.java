package com.backend.repository;

import com.backend.model.Exercise;
import com.backend.model.Coach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    
    // Find all public exercises
    List<Exercise> findByIsPublicTrue();
    
    // Find exercises by coach (for custom exercises)
    List<Exercise> findByCreatedBy(Coach coach);
    
    // Find public exercises, system exercises (createdBy IS NULL), or exercises created by a specific coach
    @Query("SELECT e FROM Exercise e WHERE e.isPublic = true OR e.createdBy IS NULL OR e.createdBy = :coach")
    List<Exercise> findAccessibleExercises(@Param("coach") Coach coach);
    
    // Search exercises by name (case-insensitive)
    @Query("SELECT e FROM Exercise e WHERE (e.isPublic = true OR e.createdBy IS NULL OR e.createdBy = :coach) " +
           "AND LOWER(e.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Exercise> searchByName(@Param("searchTerm") String searchTerm, @Param("coach") Coach coach);
    
    // Find exercises by focus area
    @Query("SELECT DISTINCT e FROM Exercise e JOIN e.focusAreas fa " +
           "WHERE (e.isPublic = true OR e.createdBy IS NULL OR e.createdBy = :coach) AND fa.id IN :focusAreaIds")
    List<Exercise> findByFocusAreaIds(@Param("focusAreaIds") List<Long> focusAreaIds, @Param("coach") Coach coach);
    
    // Find exercises by maximum duration
    @Query("SELECT e FROM Exercise e WHERE (e.isPublic = true OR e.createdBy IS NULL OR e.createdBy = :coach) " +
           "AND e.minimumDurationMinutes <= :maxDuration")
    List<Exercise> findByMaxDuration(@Param("maxDuration") Integer maxDuration, @Param("coach") Coach coach);
    
    // Complex search with all filters
    @Query("SELECT DISTINCT e FROM Exercise e LEFT JOIN e.focusAreas fa " +
           "WHERE (e.isPublic = true OR e.createdBy IS NULL OR e.createdBy = :coach) " +
           "AND (:searchTerm IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND (:maxDuration IS NULL OR e.minimumDurationMinutes <= :maxDuration) " +
           "AND (:focusAreaIds IS NULL OR fa.id IN :focusAreaIds)")
    Page<Exercise> findWithFilters(
        @Param("searchTerm") String searchTerm,
        @Param("maxDuration") Integer maxDuration,
        @Param("focusAreaIds") List<Long> focusAreaIds,
        @Param("coach") Coach coach,
        Pageable pageable
    );
    
    // Find exercises for lesson planning (with duration estimates)
    @Query("SELECT e FROM Exercise e WHERE (e.isPublic = true OR e.createdBy IS NULL OR e.createdBy = :coach) " +
           "ORDER BY e.name ASC")
    List<Exercise> findAllForLessonPlanning(@Param("coach") Coach coach);
    
    // Count custom exercises by coach
    Long countByCreatedBy(Coach coach);
    
    // Find most popular exercises (based on usage in lessons)
    @Query("SELECT e, COUNT(le) as usageCount FROM Exercise e " +
           "LEFT JOIN LessonExercise le ON le.exercise = e " +
           "WHERE e.isPublic = true OR e.createdBy IS NULL OR e.createdBy = :coach " +
           "GROUP BY e ORDER BY usageCount DESC")
    List<Object[]> findMostPopularExercises(@Param("coach") Coach coach, Pageable pageable);
}