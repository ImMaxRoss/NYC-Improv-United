package com.backend.repository;

import com.backend.model.FocusArea;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface FocusAreaRepository extends JpaRepository<FocusArea, Long> {
    
    // Find by name (case-insensitive)
    Optional<FocusArea> findByNameIgnoreCase(String name);
    
    // Find all ordered by name
    List<FocusArea> findAllByOrderByNameAsc();
    
    // Check if focus area exists by name
    boolean existsByNameIgnoreCase(String name);
    
    // Find focus areas used in exercises
    @Query("SELECT DISTINCT fa FROM FocusArea fa JOIN fa.exercises e WHERE e.isPublic = true")
    List<FocusArea> findUsedInPublicExercises();
    
    // Find most popular focus areas (by exercise count)
    @Query("SELECT fa, COUNT(e) as exerciseCount FROM FocusArea fa " +
           "LEFT JOIN fa.exercises e WHERE e.isPublic = true " +
           "GROUP BY fa ORDER BY exerciseCount DESC")
    List<Object[]> findMostPopularFocusAreas();
    
    // Find focus areas by color code
    List<FocusArea> findByColorCode(String colorCode);
    
    // Get focus areas with their exercise counts
    @Query("SELECT fa, COUNT(e) FROM FocusArea fa LEFT JOIN fa.exercises e GROUP BY fa")
    List<Object[]> findFocusAreasWithExerciseCounts();
}