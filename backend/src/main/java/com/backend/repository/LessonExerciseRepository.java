package com.backend.repository;

import com.backend.model.LessonExercise;
import com.backend.model.Lesson;
import com.backend.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonExerciseRepository extends JpaRepository<LessonExercise, Long> {
    
    // Find exercises for a lesson in order
    List<LessonExercise> findByLessonOrderByOrderIndexAsc(Lesson lesson);
    
    // Find by lesson and exercise
    Optional<LessonExercise> findByLessonAndExercise(Lesson lesson, Exercise exercise);
    
    // Find by lesson and order index
    Optional<LessonExercise> findByLessonAndOrderIndex(Lesson lesson, Integer orderIndex);
    
    // Get maximum order index for a lesson
    @Query("SELECT MAX(le.orderIndex) FROM LessonExercise le WHERE le.lesson = :lesson")
    Optional<Integer> findMaxOrderIndexByLesson(@Param("lesson") Lesson lesson);
    
    // Calculate total planned duration for a lesson
    @Query("SELECT SUM(le.plannedDurationMinutes) FROM LessonExercise le WHERE le.lesson = :lesson")
    Optional<Integer> calculateTotalDuration(@Param("lesson") Lesson lesson);
    
    // Get focus area breakdown for a lesson
    @Query("SELECT fa.name, SUM(le.plannedDurationMinutes) " +
           "FROM LessonExercise le JOIN le.exercise.focusAreas fa " +
           "WHERE le.lesson = :lesson " +
           "GROUP BY fa.id, fa.name")
    List<Object[]> getFocusAreaTimeBreakdown(@Param("lesson") Lesson lesson);
    
    // Find lesson exercises with evaluation templates
    @Query("SELECT le FROM LessonExercise le WHERE le.lesson = :lesson AND le.evaluationTemplate IS NOT NULL")
    List<LessonExercise> findByLessonWithEvaluationTemplates(@Param("lesson") Lesson lesson);
    
    // Count exercises in lesson
    Long countByLesson(Lesson lesson);
    
    // Find exercises that need duration planning
    @Query("SELECT le FROM LessonExercise le WHERE le.lesson = :lesson AND le.plannedDurationMinutes IS NULL")
    List<LessonExercise> findExercisesNeedingDuration(@Param("lesson") Lesson lesson);
    
    // Find next exercise in sequence
    @Query("SELECT le FROM LessonExercise le WHERE le.lesson = :lesson AND le.orderIndex > :currentIndex " +
           "ORDER BY le.orderIndex ASC")
    List<LessonExercise> findNextExercises(@Param("lesson") Lesson lesson, @Param("currentIndex") Integer currentIndex);
    
    // Find previous exercise in sequence
    @Query("SELECT le FROM LessonExercise le WHERE le.lesson = :lesson AND le.orderIndex < :currentIndex " +
           "ORDER BY le.orderIndex DESC")
    List<LessonExercise> findPreviousExercises(@Param("lesson") Lesson lesson, @Param("currentIndex") Integer currentIndex);
}