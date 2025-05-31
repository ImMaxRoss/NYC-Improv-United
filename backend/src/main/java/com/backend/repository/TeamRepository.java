package com.backend.repository;

import com.backend.model.Coach;
import com.backend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    // ... other methods ...

    @Query("SELECT t.coach.coachId FROM Team t WHERE t.teamId = :teamId")
    Long findTeamId(@Param("teamId") Long teamId);

    // ENSURE THIS METHOD IS UPDATED TO JPQL (NO nativeQuery = true)
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Team t WHERE t.teamId = :teamId AND t.coach.coachId = :coachId")
    boolean isTeamOwnedByCoach(@Param("teamId") Long teamId, @Param("coachId") Long coachId);

    // Your other existing JPQL query (should be fine)
    @Query("SELECT COUNT(t) > 0 FROM Team t WHERE t.name = :name AND t.coach.coachId = :coachId")
    boolean existsByNameAndCoachId(@Param("name") String name, @Param("coachId") Long coachId);

    List<Team> findByCoach_CoachId(Long coachId);

    boolean existsByNameAndCoach_CoachId(String name, Long coachId);
    
    // Find team with performers eagerly loaded
    @Query("SELECT DISTINCT t FROM Team t LEFT JOIN FETCH t.performers WHERE t.teamId = :teamId")
    Optional<Team> findByIdWithPerformers(@Param("teamId") Long teamId);
    
    // Find all teams for a coach with performer count
    @Query("SELECT t FROM Team t LEFT JOIN FETCH t.performers WHERE t.coach.coachId = :coachId")
    List<Team> findByCoachIdWithPerformers(@Param("coachId") Long coachId);
    
    // Check if performer is in team
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Team t JOIN t.performers p WHERE t.teamId = :teamId AND p.id = :performerId")
    boolean isPerformerInTeam(@Param("teamId") Long teamId, @Param("performerId") Long performerId);
    
    // Get performer count for team
    @Query("SELECT COUNT(p) FROM Team t JOIN t.performers p WHERE t.teamId = :teamId")
    Long getPerformerCount(@Param("teamId") Long teamId);
    
    // Find teams by performer
    @Query("SELECT t FROM Team t JOIN t.performers p WHERE p.id = :performerId AND t.coach.coachId = :coachId")
    List<Team> findTeamsByPerformerAndCoach(@Param("performerId") Long performerId, @Param("coachId") Long coachId);
    
    Optional<Team> findByTeamIdAndCoach(Long teamId, Coach coach);

}