package com.backend.repository;

import com.backend.model.Performer;
import com.backend.model.Coach;
import com.backend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerformerRepository extends JpaRepository<Performer, Long> {
    
    // Find all performers by coach
    List<Performer> findByCoachOrderByLastNameAscFirstNameAsc(Coach coach);
    
    // Find performer by coach and ID (for security)
    Optional<Performer> findByIdAndCoach(Long id, Coach coach);
    
    // Find performers by team
    @Query("SELECT p FROM Performer p JOIN p.teams t WHERE t = :team ORDER BY p.lastName ASC, p.firstName ASC")
    List<Performer> findByTeam(@Param("team") Team team);
    
    // Find performers by team and coach (security check)
    @Query("SELECT p FROM Performer p JOIN p.teams t WHERE t = :team AND p.coach = :coach " +
           "ORDER BY p.lastName ASC, p.firstName ASC")
    List<Performer> findByTeamAndCoach(@Param("team") Team team, @Param("coach") Coach coach);
    
    // Find performers not in a specific team
    @Query("SELECT p FROM Performer p WHERE p.coach = :coach AND p NOT IN " +
           "(SELECT p2 FROM Performer p2 JOIN p2.teams t WHERE t = :team) " +
           "ORDER BY p.lastName ASC, p.firstName ASC")
    List<Performer> findByCoachNotInTeam(@Param("coach") Coach coach, @Param("team") Team team);
    
    // Search performers by name
    @Query("SELECT p FROM Performer p WHERE p.coach = :coach AND " +
           "(LOWER(CONCAT(p.firstName, ' ', p.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(CONCAT(p.lastName, ' ', p.firstName)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY p.lastName ASC, p.firstName ASC")
    List<Performer> searchByName(@Param("searchTerm") String searchTerm, @Param("coach") Coach coach);
    

    // Find performers with email
    @Query("SELECT p FROM Performer p WHERE p.coach = :coach AND p.email IS NOT NULL AND p.email != '' " +
           "ORDER BY p.lastName ASC, p.firstName ASC")
    List<Performer> findByCoachWithEmail(@Param("coach") Coach coach);
    
    // Count performers by coach
    Long countByCoach(Coach coach);
    
    // Count performers in team
    @Query("SELECT COUNT(p) FROM Performer p JOIN p.teams t WHERE t = :team")
    Long countByTeam(@Param("team") Team team);
    
    // Find performers by multiple IDs and coach (for security)
    @Query("SELECT p FROM Performer p WHERE p.id IN :ids AND p.coach = :coach")
    List<Performer> findByIdsAndCoach(@Param("ids") List<Long> ids, @Param("coach") Coach coach);
    
    // Check if performer exists for coach
    boolean existsByIdAndCoach(Long id, Coach coach);
    
    // Find performers without teams
    @Query("SELECT p FROM Performer p WHERE p.coach = :coach AND p.teams IS EMPTY " +
           "ORDER BY p.lastName ASC, p.firstName ASC")
    List<Performer> findByCoachWithoutTeams(@Param("coach") Coach coach);
    
}