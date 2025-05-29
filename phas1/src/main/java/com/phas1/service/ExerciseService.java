package com.phas1.service;

import com.phas1.model.*;
import com.phas1.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class ExerciseService {

    @Autowired
    private ExerciseRepository exerciseRepository;
    
    @Autowired
    private FocusAreaRepository focusAreaRepository;
    
    @Autowired
    private EvaluationTemplateRepository evaluationTemplateRepository;

    /**
     * Create a new exercise
     */
    public Exercise createExercise(Exercise exercise, Coach coach) {
        exercise.setCreatedBy(coach);
        
        // Validate focus areas
        if (exercise.getFocusAreas() != null) {
            Set<FocusArea> validatedFocusAreas = validateFocusAreas(exercise.getFocusAreas());
            exercise.setFocusAreas(validatedFocusAreas);
        }
        
        // Set default minimum duration if not provided
        if (exercise.getMinimumDurationMinutes() == null) {
            exercise.setMinimumDurationMinutes(5);
        }
        
        Exercise savedExercise = exerciseRepository.save(exercise);
        
        // Create default evaluation template if needed
        if (exercise.getDefaultEvaluationTemplate() != null) {
            EvaluationTemplate template = exercise.getDefaultEvaluationTemplate();
            template.setExercise(savedExercise);
            template.setCreatedBy(coach);
            evaluationTemplateRepository.save(template);
        }
        
        return savedExercise;
    }

    /**
     * Update an existing exercise
     */
    public Exercise updateExercise(Long exerciseId, Exercise updatedExercise, Coach coach) {
        Exercise existingExercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        // Verify coach has permission to update this exercise
        if (!existingExercise.getCreatedBy().equals(coach)) {
            throw new IllegalArgumentException("Access denied: You can only update exercises you created");
        }
        
        // Update fields
        existingExercise.setName(updatedExercise.getName());
        existingExercise.setDescription(updatedExercise.getDescription());
        existingExercise.setMinimumDurationMinutes(updatedExercise.getMinimumDurationMinutes());
        existingExercise.setPublic(updatedExercise.isPublic());
        
        // Update focus areas
        if (updatedExercise.getFocusAreas() != null) {
            Set<FocusArea> validatedFocusAreas = validateFocusAreas(updatedExercise.getFocusAreas());
            existingExercise.setFocusAreas(validatedFocusAreas);
        }
        
        return exerciseRepository.save(existingExercise);
    }

    /**
     * Get exercise by ID
     */
    @Transactional(readOnly = true)
    public Optional<Exercise> findById(Long exerciseId) {
        return exerciseRepository.findById(exerciseId);
    }

    /**
     * Get exercise by ID with access check
     */
    @Transactional(readOnly = true)
    public Optional<Exercise> findByIdWithAccess(Long exerciseId, Coach coach) {
        Optional<Exercise> exercise = exerciseRepository.findById(exerciseId);
        
        if (exercise.isPresent()) {
            Exercise ex = exercise.get();
            // Check if coach has access (public exercise or created by coach)
            if (ex.isPublic() || ex.getCreatedBy().equals(coach)) {
                return exercise;
            }
        }
        
        return Optional.empty();
    }

    /**
     * Search exercises with filters
     */
    @Transactional(readOnly = true)
    public Page<Exercise> searchExercises(String searchTerm, Integer maxDuration, 
                                        List<Long> focusAreaIds, Coach coach, Pageable pageable) {
        return exerciseRepository.findWithFilters(searchTerm, maxDuration, focusAreaIds, coach, pageable);
    }

    /**
     * Get all exercises accessible to coach
     */
    @Transactional(readOnly = true)
    public List<Exercise> getAccessibleExercises(Coach coach) {
        return exerciseRepository.findAccessibleExercises(coach);
    }

    /**
     * Get exercises for lesson planning
     */
    @Transactional(readOnly = true)
    public List<Exercise> getExercisesForLessonPlanning(Coach coach) {
        return exerciseRepository.findAllForLessonPlanning(coach);
    }

    /**
     * Get exercises by focus area
     */
    @Transactional(readOnly = true)
    public List<Exercise> getExercisesByFocusArea(List<Long> focusAreaIds, Coach coach) {
        return exerciseRepository.findByFocusAreaIds(focusAreaIds, coach);
    }

    /**
     * Get exercises by maximum duration
     */
    @Transactional(readOnly = true)
    public List<Exercise> getExercisesByMaxDuration(Integer maxDuration, Coach coach) {
        return exerciseRepository.findByMaxDuration(maxDuration, coach);
    }

    /**
     * Search exercises by name
     */
    @Transactional(readOnly = true)
    public List<Exercise> searchByName(String searchTerm, Coach coach) {
        return exerciseRepository.searchByName(searchTerm, coach);
    }

    /**
     * Get custom exercises created by coach
     */
    @Transactional(readOnly = true)
    public List<Exercise> getCustomExercises(Coach coach) {
        return exerciseRepository.findByCreatedBy(coach);
    }

    /**
     * Get most popular exercises
     */
    @Transactional(readOnly = true)
    public List<Object[]> getMostPopularExercises(Coach coach, Pageable pageable) {
        return exerciseRepository.findMostPopularExercises(coach, pageable);
    }

    /**
     * Delete exercise
     */
    public void deleteExercise(Long exerciseId, Coach coach) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        // Verify coach has permission to delete this exercise
        if (!exercise.getCreatedBy().equals(coach)) {
            throw new IllegalArgumentException("Access denied: You can only delete exercises you created");
        }
        
        exerciseRepository.delete(exercise);
    }

    /**
     * Duplicate exercise
     */
    public Exercise duplicateExercise(Long exerciseId, String newName, Coach coach) {
        Exercise originalExercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        // Check access
        if (!originalExercise.isPublic() && !originalExercise.getCreatedBy().equals(coach)) {
            throw new IllegalArgumentException("Access denied to this exercise");
        }
        
        // Create duplicate
        Exercise duplicate = new Exercise();
        duplicate.setName(newName != null ? newName : originalExercise.getName() + " (Copy)");
        duplicate.setDescription(originalExercise.getDescription());
        duplicate.setMinimumDurationMinutes(originalExercise.getMinimumDurationMinutes());
        duplicate.setCreatedBy(coach);
        duplicate.setPublic(false); // Duplicates are private by default
        duplicate.setFocusAreas(originalExercise.getFocusAreas());
        
        return exerciseRepository.save(duplicate);
    }

    /**
     * Seed default exercises (for system initialization)
     */
    public void seedDefaultExercises() {
        if (exerciseRepository.count() > 0) {
            return; // Already seeded
        }
        
        // Get focus areas
        List<FocusArea> focusAreas = focusAreaRepository.findAll();
        
        // Create default exercises
        createDefaultExercise("Word Association", 
            "Players stand in a circle and say words that relate to the previous word.", 
            5, focusAreas);
        
        createDefaultExercise("Yes And", 
            "Players build on each other's ideas by accepting and adding to them.", 
            10, focusAreas);
        
        createDefaultExercise("Freeze Tag", 
            "Two players create a scene, others call 'freeze' and take their place.", 
            15, focusAreas);
        
        createDefaultExercise("Gibberish", 
            "Players perform scenes using made-up language, focusing on emotion and physicality.", 
            12, focusAreas);
        
        createDefaultExercise("Party Host", 
            "One player is the host, others arrive with distinct character traits.", 
            20, focusAreas);
        
        // Add more default exercises as needed...
    }

    // ===== PRIVATE HELPER METHODS =====

    private Set<FocusArea> validateFocusAreas(Set<FocusArea> focusAreas) {
        Set<FocusArea> validatedAreas = new HashSet<>();
        
        for (FocusArea area : focusAreas) {
            if (area.getId() != null) {
                FocusArea existingArea = focusAreaRepository.findById(area.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Focus area not found: " + area.getId()));
                validatedAreas.add(existingArea);
            }
        }
        
        return validatedAreas;
    }

    private void createDefaultExercise(String name, String description, Integer duration, List<FocusArea> allFocusAreas) {
        Exercise exercise = new Exercise();
        exercise.setName(name);
        exercise.setDescription(description);
        exercise.setMinimumDurationMinutes(duration);
        exercise.setCreatedBy(null); // System exercise
        exercise.setPublic(true);
        
        // Assign relevant focus areas based on exercise type
        Set<FocusArea> exerciseFocusAreas = new HashSet<>();
        
        // Simple logic to assign focus areas - in real implementation, this would be more sophisticated
        switch (name) {
            case "Yes And":
                exerciseFocusAreas.addAll(allFocusAreas.stream()
                    .filter(fa -> fa.getName().equals("Yes And") || fa.getName().equals("Agreement"))
                    .toList());
                break;
            case "Freeze Tag":
                exerciseFocusAreas.addAll(allFocusAreas.stream()
                    .filter(fa -> fa.getName().equals("Physicality") || fa.getName().equals("Commitment"))
                    .toList());
                break;
            case "Gibberish":
                exerciseFocusAreas.addAll(allFocusAreas.stream()
                    .filter(fa -> fa.getName().equals("Physicality") || fa.getName().equals("Listening"))
                    .toList());
                break;
            default:
                // Add first focus area as default
                if (!allFocusAreas.isEmpty()) {
                    exerciseFocusAreas.add(allFocusAreas.get(0));
                }
                break;
        }
        
        exercise.setFocusAreas(exerciseFocusAreas);
        exerciseRepository.save(exercise);
    }
}