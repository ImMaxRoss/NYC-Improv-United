package com.backend.service;

import com.backend.model.*;
import com.backend.repository.*;
import com.backend.util.LessonNameGenerator;
import com.backend.util.TimeCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Service
@Transactional
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;
    
    @Autowired
    private LessonExerciseRepository lessonExerciseRepository;
    
    @Autowired
    private ExerciseRepository exerciseRepository;
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private LessonNameGenerator lessonNameGenerator;
    
    @Autowired
    private TimeCalculator timeCalculator;

    /**
     * Create a new lesson
     */
    public Lesson createLesson(Lesson lesson, Coach coach) {
        lesson.setCoach(coach);
        
        // Generate name if not provided
        if (lesson.getName() == null || lesson.getName().trim().isEmpty()) {
            lesson.setName(lessonNameGenerator.generateName(lesson));
        }
        
        // IMPORTANT: Set the bidirectional relationship AND orderIndex BEFORE saving
        if (lesson.getExercises() != null && !lesson.getExercises().isEmpty()) {
            for (int i = 0; i < lesson.getExercises().size(); i++) {
                LessonExercise exercise = lesson.getExercises().get(i);
                exercise.setLesson(lesson); // Set the parent reference
                exercise.setOrderIndex(i + 1); // Set the order index
                
                // Set default duration if not provided
                if (exercise.getPlannedDurationMinutes() == null && exercise.getExercise() != null) {
                    exercise.setPlannedDurationMinutes(exercise.getExercise().getMinimumDurationMinutes());
                }
            }
            lesson.setTotalDurationMinutes(timeCalculator.calculateTotalDuration(lesson.getExercises()));
        }
        
        // Now save - this will cascade save the exercises with proper lesson_id and order_index
        Lesson savedLesson = lessonRepository.save(lesson);
        
        return savedLesson;
    }

    /**
     * Update an existing lesson
     */
    public Lesson updateLesson(Long lessonId, Lesson updatedLesson, Coach coach) {
        Lesson existingLesson = lessonRepository.findByIdAndCoach(lessonId, coach)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found or access denied"));
        
        // Update basic fields
        existingLesson.setName(updatedLesson.getName());
        existingLesson.setScheduledDate(updatedLesson.getScheduledDate());
        existingLesson.setWorkshopType(updatedLesson.getWorkshopType());
        existingLesson.setTeam(updatedLesson.getTeam());
        
        // Update exercises if provided
        if (updatedLesson.getExercises() != null) {
            // Remove existing exercises
            lessonExerciseRepository.deleteAll(existingLesson.getExercises());
            existingLesson.getExercises().clear();
            
            // Add new exercises
            saveLessonExercises(existingLesson, updatedLesson.getExercises());
        }
        
        // Recalculate duration
        existingLesson.setTotalDurationMinutes(timeCalculator.calculateTotalDuration(existingLesson.getExercises()));
        
        return lessonRepository.save(existingLesson);
    }

    /**
     * Get upcoming lessons for a coach
     */
    @Transactional(readOnly = true)
    public List<Lesson> getUpcomingLessons(Coach coach) {
        return lessonRepository.findUpcomingLessons(coach, LocalDateTime.now());
    }

    /**
     * Get lesson templates for a coach
     */
    @Transactional(readOnly = true)
    public List<Lesson> getMyTemplates(Coach coach) {
        return lessonRepository.findByCoachAndIsTemplateTrue(coach);
    }

    /**
     * Get recent lessons for dashboard
     */
    @Transactional(readOnly = true)
    public List<Lesson> getRecentLessons(Coach coach, int limit) {
        return lessonRepository.findRecentLessons(coach, PageRequest.of(0, limit));
    }

    /**
     * Save lesson as template
     */
    public Lesson saveAsTemplate(Long lessonId, Coach coach) {
        Lesson originalLesson = lessonRepository.findByIdAndCoach(lessonId, coach)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found or access denied"));
        
        // Create template copy
        Lesson template = new Lesson();
        template.setCoach(coach);
        template.setName(originalLesson.getName() + " Template");
        template.setIsTemplate(true);
        template.setWorkshopType(originalLesson.getWorkshopType());
        template.setTotalDurationMinutes(originalLesson.getTotalDurationMinutes());
        
        Lesson savedTemplate = lessonRepository.save(template);
        
        // Copy exercises
        List<LessonExercise> originalExercises = lessonExerciseRepository.findByLessonOrderByOrderIndexAsc(originalLesson);
        for (LessonExercise originalExercise : originalExercises) {
            LessonExercise templateExercise = new LessonExercise();
            templateExercise.setLesson(savedTemplate);
            templateExercise.setExercise(originalExercise.getExercise());
            templateExercise.setOrderIndex(originalExercise.getOrderIndex());
            templateExercise.setPlannedDurationMinutes(originalExercise.getPlannedDurationMinutes());
            templateExercise.setEvaluationTemplate(originalExercise.getEvaluationTemplate());
            templateExercise.setExerciseNotes(originalExercise.getExerciseNotes());
            
            lessonExerciseRepository.save(templateExercise);
        }
        
        return savedTemplate;
    }

    /**
     * Create lesson from template
     */
    public Lesson createFromTemplate(Long templateId, LocalDateTime scheduledDate, String customName, Long teamId, Coach coach) {
        Lesson template = lessonRepository.findByIdAndCoach(templateId, coach)
                .orElseThrow(() -> new IllegalArgumentException("Template not found or access denied"));
        
        if (!template.isTemplate()) {
            throw new IllegalArgumentException("Specified lesson is not a template");
        }
        
        // Create new lesson
        Lesson newLesson = new Lesson();
        newLesson.setCoach(coach);
        newLesson.setScheduledDate(scheduledDate);
        newLesson.setWorkshopType(template.getWorkshopType());
        newLesson.setTotalDurationMinutes(template.getTotalDurationMinutes());
        newLesson.setIsTemplate(false);
        
        // Set name
        if (customName != null && !customName.trim().isEmpty()) {
            newLesson.setName(customName);
        } else {
            newLesson.setName(lessonNameGenerator.generateName(newLesson));
        }
        
        // Set team if provided
        if (teamId != null) {
            Team team = teamRepository.findByTeamIdAndCoach(teamId, coach)
                    .orElseThrow(() -> new IllegalArgumentException("Team not found or access denied"));
            newLesson.setTeam(team);
        }
        
        Lesson savedLesson = lessonRepository.save(newLesson);
        
        // Copy exercises from template
        List<LessonExercise> templateExercises = lessonExerciseRepository.findByLessonOrderByOrderIndexAsc(template);
        for (LessonExercise templateExercise : templateExercises) {
            LessonExercise newExercise = new LessonExercise();
            newExercise.setLesson(savedLesson);
            newExercise.setExercise(templateExercise.getExercise());
            newExercise.setOrderIndex(templateExercise.getOrderIndex());
            newExercise.setPlannedDurationMinutes(templateExercise.getPlannedDurationMinutes());
            newExercise.setEvaluationTemplate(templateExercise.getEvaluationTemplate());
            newExercise.setExerciseNotes(templateExercise.getExerciseNotes());
            
            lessonExerciseRepository.save(newExercise);
        }
        
        return savedLesson;
    }

    /**
     * Add exercise to lesson
     */
    public LessonExercise addExerciseToLesson(Long lessonId, Long exerciseId, Integer duration, Coach coach) {
        Lesson lesson = lessonRepository.findByIdAndCoach(lessonId, coach)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found or access denied"));
        
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        // Verify coach has access to this exercise
        if (!exercise.isPublic() && !exercise.getCreatedBy().equals(coach)) {
            throw new IllegalArgumentException("Access denied to this exercise");
        }
        
        // Get next order index
        Optional<Integer> maxOrderIndex = lessonExerciseRepository.findMaxOrderIndexByLesson(lesson);
        int nextOrderIndex = maxOrderIndex.orElse(0) + 1;
        
        // Create lesson exercise
        LessonExercise lessonExercise = new LessonExercise();
        lessonExercise.setLesson(lesson);
        lessonExercise.setExercise(exercise);
        lessonExercise.setOrderIndex(nextOrderIndex);
        lessonExercise.setPlannedDurationMinutes(duration != null ? duration : exercise.getMinimumDurationMinutes());
        
        // Set default evaluation template if exercise has one
        if (exercise.getDefaultEvaluationTemplate() != null) {
            lessonExercise.setEvaluationTemplate(exercise.getDefaultEvaluationTemplate());
        }
        
        LessonExercise saved = lessonExerciseRepository.save(lessonExercise);
        
        // Update lesson total duration
        lesson.setTotalDurationMinutes(timeCalculator.calculateTotalDuration(lesson.getExercises()));
        lessonRepository.save(lesson);
        
        return saved;
    }

    /**
     * Remove exercise from lesson
     */
    public void removeExerciseFromLesson(Long lessonId, Long lessonExerciseId, Coach coach) {
        Lesson lesson = lessonRepository.findByIdAndCoach(lessonId, coach)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found or access denied"));
        
        LessonExercise lessonExercise = lessonExerciseRepository.findById(lessonExerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson exercise not found"));
        
        if (!lessonExercise.getLesson().equals(lesson)) {
            throw new IllegalArgumentException("Exercise does not belong to this lesson");
        }
        
        lessonExerciseRepository.delete(lessonExercise);
        
        // Reorder remaining exercises
        reorderExercises(lesson);
        
        // Update lesson total duration
        lesson.setTotalDurationMinutes(timeCalculator.calculateTotalDuration(lesson.getExercises()));
        lessonRepository.save(lesson);
    }

    /**
     * Reorder exercises in a lesson
     */
    public void reorderExercises(Long lessonId, List<Long> exerciseIds, Coach coach) {
        Lesson lesson = lessonRepository.findByIdAndCoach(lessonId, coach)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found or access denied"));
        
        List<LessonExercise> exercises = lessonExerciseRepository.findByLessonOrderByOrderIndexAsc(lesson);
        
        // Validate that all provided IDs exist in the lesson
        if (exerciseIds.size() != exercises.size()) {
            throw new IllegalArgumentException("Invalid exercise list for reordering");
        }
        
        // Update order indices
        IntStream.range(0, exerciseIds.size()).forEach(i -> {
            Long exerciseId = exerciseIds.get(i);
            LessonExercise exercise = exercises.stream()
                    .filter(le -> le.getId().equals(exerciseId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Exercise not found in lesson"));
            
            exercise.setOrderIndex(i + 1);
            lessonExerciseRepository.save(exercise);
        });
    }

    /**
     * Get lesson by ID with security check
     */
    @Transactional(readOnly = true)
    public Optional<Lesson> getLessonById(Long lessonId, Coach coach) {
        return lessonRepository.findByIdAndCoach(lessonId, coach);
    }

    /**
     * Delete lesson
     */
    public void deleteLesson(Long lessonId, Coach coach) {
        Lesson lesson = lessonRepository.findByIdAndCoach(lessonId, coach)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found or access denied"));
        
        lessonRepository.delete(lesson);
    }

    /**
     * Get focus area time breakdown for a lesson
     */
    @Transactional(readOnly = true)
    public List<Object[]> getFocusAreaBreakdown(Long lessonId, Coach coach) {
        Lesson lesson = lessonRepository.findByIdAndCoach(lessonId, coach)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found or access denied"));
        
        return lessonExerciseRepository.getFocusAreaTimeBreakdown(lesson);
    }

    // ===== PRIVATE HELPER METHODS =====

	private void saveLessonExercises(Lesson lesson, List<LessonExercise> exercises) {
		for (int i = 0; i < exercises.size(); i++) {
			LessonExercise exercise = exercises.get(i);
			exercise.setLesson(lesson);
			exercise.setOrderIndex(i + 1);
			
			// Set default duration if not provided
			if (exercise.getPlannedDurationMinutes() == null && exercise.getExercise() != null) {
				exercise.setPlannedDurationMinutes(exercise.getExercise().getMinimumDurationMinutes());
			}
			
			// No need to save individually if cascade is handling it
			// lessonExerciseRepository.save(exercise);
		}
	}



    private void reorderExercises(Lesson lesson) {
        List<LessonExercise> exercises = lessonExerciseRepository.findByLessonOrderByOrderIndexAsc(lesson);
        
        for (int i = 0; i < exercises.size(); i++) {
            exercises.get(i).setOrderIndex(i + 1);
            lessonExerciseRepository.save(exercises.get(i));
        }
    }
}
