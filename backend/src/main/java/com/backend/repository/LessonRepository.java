package com.backend.repository;

import com.backend.model.Lesson;
import com.backend.model.Coach;
import com.backend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    
    // Find all lessons by coach
    List<Lesson> findByCoachOrderByScheduledDateDesc(Coach coach);
    
    // Find upcoming lessons (non-templates, future scheduled date)
    @Query("SELECT l FROM Lesson l WHERE l.coach = :coach AND l.isTemplate = false " +
           "AND l.scheduledDate IS NOT NULL AND l.scheduledDate > :now " +
           "ORDER BY l.scheduledDate ASC")
    List<Lesson> findUpcomingLessons(@Param("coach") Coach coach, @Param("now") LocalDateTime now);
    
    // Find lesson templates
    List<Lesson> findByCoachAndIsTemplateTrue(Coach coach);
    
    // Find lessons by team
    List<Lesson> findByTeamOrderByScheduledDateDesc(Team team);
    
    // Find lessons by team and coach (for security)
    List<Lesson> findByTeamAndCoachOrderByScheduledDateDesc(Team team, Coach coach);
    
    // Find lessons in date range
    @Query("SELECT l FROM Lesson l WHERE l.coach = :coach " +
           "AND l.scheduledDate BETWEEN :startDate AND :endDate " +
           "ORDER BY l.scheduledDate ASC")
    List<Lesson> findByCoachAndDateRange(
        @Param("coach") Coach coach,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    // Find lessons by coach with security check
    Optional<Lesson> findByIdAndCoach(Long id, Coach coach);
    
    // Find recent lessons (for dashboard)
    @Query("SELECT l FROM Lesson l WHERE l.coach = :coach AND l.isTemplate = false " +
           "ORDER BY l.scheduledDate DESC")
    List<Lesson> findRecentLessons(@Param("coach") Coach coach, org.springframework.data.domain.Pageable pageable);
    
    // Count lessons by coach
    Long countByCoach(Coach coach);
    
    // Count templates by coach
    Long countByCoachAndIsTemplateTrue(Coach coach);
    
    // Find lessons needing names (for auto-generation)
    @Query("SELECT l FROM Lesson l WHERE l.coach = :coach AND l.name IS NULL AND l.isTemplate = false")
    List<Lesson> findLessonsNeedingNames(@Param("coach") Coach coach);
    
    // Find lessons by workshop type
    List<Lesson> findByCoachAndWorkshopType(Coach coach, String workshopType);
}