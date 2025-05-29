package com.phas1.controller;

import com.phas1.dto.*;
import com.phas1.model.*;
// import com.phas1.repository.EvaluationTemplateRepository;
import com.phas1.service.*;
import com.phas1.util.TimeCalculator;
import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exercises")
@Tag(name = "Exercise Management", description = "Endpoints for managing improv exercises")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private FocusAreaService focusAreaService;
    
    // @Autowired
    // private EvaluationTemplateRepository evaluationTemplateRepository;

    // ===== CREATE OPERATIONS =====

    @PostMapping
    @Operation(summary = "Create a new exercise", description = "Create a custom exercise for the authenticated coach")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Exercise created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<ExerciseResponse> createExercise(
            @Valid @RequestBody ExerciseRequest request,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        // Map request to entity
        Exercise exercise = new Exercise();
        exercise.setName(request.getName());
        exercise.setDescription(request.getDescription());
        exercise.setMinimumDurationMinutes(request.getMinimumDurationMinutes());
        exercise.setPublic(request.isPublic());
        
        // Set focus areas
        if (request.getFocusAreaIds() != null && !request.getFocusAreaIds().isEmpty()) {
            Set<FocusArea> focusAreas = new HashSet<>();
            for (Long focusAreaId : request.getFocusAreaIds()) {
                FocusArea focusArea = focusAreaService.getFocusAreaById(focusAreaId)
                        .orElseThrow(() -> new IllegalArgumentException("Focus area not found: " + focusAreaId));
                focusAreas.add(focusArea);
            }
            exercise.setFocusAreas(focusAreas);
        }
        
        // Create evaluation template if provided
        if (request.getEvaluationTemplateName() != null && request.getEvaluationCriteria() != null) {
            EvaluationTemplate template = createEvaluationTemplate(request, coach);
            exercise.setDefaultEvaluationTemplate(template);
        }
        
        Exercise savedExercise = exerciseService.createExercise(exercise, coach);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToExerciseResponse(savedExercise));
    }

    // ===== READ OPERATIONS =====

    @GetMapping("/{id}")
    @Operation(summary = "Get exercise by ID", description = "Retrieve a specific exercise if accessible to the coach")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Exercise found"),
        @ApiResponse(responseCode = "404", description = "Exercise not found or not accessible"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<ExerciseResponse> getExerciseById(
            @PathVariable Long id,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        Optional<Exercise> exercise = exerciseService.findByIdWithAccess(id, coach);
        
        return exercise.map(ex -> ResponseEntity.ok(mapToExerciseResponse(ex)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Search exercises", description = "Search and filter exercises with pagination")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Exercises retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<Page<ExerciseResponse>> searchExercises(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Integer maxDuration,
            @RequestParam(required = false) List<Long> focusAreaIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Exercise> exercises = exerciseService.searchExercises(
                searchTerm, maxDuration, focusAreaIds, coach, pageable);
        
        Page<ExerciseResponse> response = exercises.map(this::mapToExerciseResponse);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/accessible")
    @Operation(summary = "Get all accessible exercises", description = "Get all public exercises and coach's custom exercises")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Exercises retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<ExerciseSummaryResponse>> getAccessibleExercises(
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        List<Exercise> exercises = exerciseService.getAccessibleExercises(coach);
        
        List<ExerciseSummaryResponse> response = exercises.stream()
                .map(this::mapToExerciseSummary)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/lesson-planning")
    @Operation(summary = "Get exercises for lesson planning", description = "Get exercises optimized for lesson planning")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Exercises retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<ExerciseSummaryResponse>> getExercisesForLessonPlanning(
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        List<Exercise> exercises = exerciseService.getExercisesForLessonPlanning(coach);
        
        List<ExerciseSummaryResponse> response = exercises.stream()
                .map(this::mapToExerciseSummary)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/custom")
    @Operation(summary = "Get coach's custom exercises", description = "Get all exercises created by the authenticated coach")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Exercises retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<ExerciseResponse>> getCustomExercises(
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        List<Exercise> exercises = exerciseService.getCustomExercises(coach);
        
        List<ExerciseResponse> response = exercises.stream()
                .map(this::mapToExerciseResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/popular")
    @Operation(summary = "Get popular exercises", description = "Get most frequently used exercises")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Popular exercises retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<ExerciseResponse>> getPopularExercises(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        Pageable pageable = PageRequest.of(0, limit);
        
        List<Object[]> popularExercises = exerciseService.getMostPopularExercises(coach, pageable);
        
        List<ExerciseResponse> response = popularExercises.stream()
                .map(result -> {
                    Exercise exercise = (Exercise) result[0];
                    Long usageCount = (Long) result[1];
                    ExerciseResponse dto = mapToExerciseResponse(exercise);
                    dto.setUsageCount(usageCount.intValue());
                    dto.setPopular(usageCount > 5); // Mark as popular if used more than 5 times
                    return dto;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-focus-area")
    @Operation(summary = "Get exercises by focus area", description = "Get exercises filtered by focus area IDs")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Exercises retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<ExerciseSummaryResponse>> getExercisesByFocusArea(
            @RequestParam List<Long> focusAreaIds,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        List<Exercise> exercises = exerciseService.getExercisesByFocusArea(focusAreaIds, coach);
        
        List<ExerciseSummaryResponse> response = exercises.stream()
                .map(this::mapToExerciseSummary)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-duration")
    @Operation(summary = "Get exercises by max duration", description = "Get exercises that fit within a time limit")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Exercises retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<ExerciseSummaryResponse>> getExercisesByDuration(
            @RequestParam Integer maxDuration,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        List<Exercise> exercises = exerciseService.getExercisesByMaxDuration(maxDuration, coach);
        
        List<ExerciseSummaryResponse> response = exercises.stream()
                .map(this::mapToExerciseSummary)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // ===== UPDATE OPERATIONS =====

    @PutMapping("/{id}")
    @Operation(summary = "Update exercise", description = "Update an exercise created by the authenticated coach")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Exercise updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "403", description = "Not authorized to update this exercise"),
        @ApiResponse(responseCode = "404", description = "Exercise not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<ExerciseResponse> updateExercise(
            @PathVariable Long id,
            @Valid @RequestBody ExerciseRequest request,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        // Map request to entity
        Exercise updatedExercise = new Exercise();
        updatedExercise.setName(request.getName());
        updatedExercise.setDescription(request.getDescription());
        updatedExercise.setMinimumDurationMinutes(request.getMinimumDurationMinutes());
        updatedExercise.setPublic(request.isPublic());
        
        // Set focus areas
        if (request.getFocusAreaIds() != null) {
            Set<FocusArea> focusAreas = new HashSet<>();
            for (Long focusAreaId : request.getFocusAreaIds()) {
                FocusArea focusArea = focusAreaService.getFocusAreaById(focusAreaId)
                        .orElseThrow(() -> new IllegalArgumentException("Focus area not found: " + focusAreaId));
                focusAreas.add(focusArea);
            }
            updatedExercise.setFocusAreas(focusAreas);
        }
        
        try {
            Exercise savedExercise = exerciseService.updateExercise(id, updatedExercise, coach);
            return ResponseEntity.ok(mapToExerciseResponse(savedExercise));
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Access denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== DELETE OPERATIONS =====

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete exercise", description = "Delete an exercise created by the authenticated coach")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Exercise deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Not authorized to delete this exercise"),
        @ApiResponse(responseCode = "404", description = "Exercise not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<Void> deleteExercise(
            @PathVariable Long id,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        try {
            exerciseService.deleteExercise(id, coach);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Access denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== SPECIAL OPERATIONS =====

    @PostMapping("/{id}/duplicate")
    @Operation(summary = "Duplicate exercise", description = "Create a copy of an existing exercise")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Exercise duplicated successfully"),
        @ApiResponse(responseCode = "403", description = "Not authorized to access this exercise"),
        @ApiResponse(responseCode = "404", description = "Exercise not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<ExerciseResponse> duplicateExercise(
            @PathVariable Long id,
            @RequestParam(required = false) String newName,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        try {
            Exercise duplicated = exerciseService.duplicateExercise(id, newName, coach);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapToExerciseResponse(duplicated));
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            } else if (e.getMessage().contains("Access denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/seed-defaults")
    @Operation(summary = "Seed default exercises", description = "Initialize system with default exercises (admin only)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Default exercises seeded successfully"),
        @ApiResponse(responseCode = "403", description = "Not authorized")
    })
    public ResponseEntity<Map<String, String>> seedDefaultExercises(Authentication authentication) {
        // In production, this should check for admin role
        // For now, any authenticated user can seed if no exercises exist
        
        exerciseService.seedDefaultExercises();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Default exercises seeded successfully");
        
        return ResponseEntity.ok(response);
    }

    // ===== PRIVATE HELPER METHODS =====

    private ExerciseResponse mapToExerciseResponse(Exercise exercise) {
        return ExerciseResponse.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .description(exercise.getDescription())
                .minimumDurationMinutes(exercise.getMinimumDurationMinutes())
                .formattedMinimumDuration(TimeCalculator.formatDuration(exercise.getMinimumDurationMinutes()))
                .isPublic(exercise.isPublic())
                .createdByCoachId(exercise.getCreatedBy() != null ? exercise.getCreatedBy().getCoachId() : null)
                .createdByCoachName(exercise.getCreatedBy() != null ? 
                        exercise.getCreatedBy().getFirstName() + " " + exercise.getCreatedBy().getLastName() : "System")
                .createdAt(exercise.getCreatedAt())
                .updatedAt(exercise.getUpdatedAt())
                .focusAreas(mapFocusAreas(exercise.getFocusAreas()))
                .hasDefaultEvaluationTemplate(exercise.getDefaultEvaluationTemplate() != null)
                .defaultEvaluationTemplateName(exercise.getDefaultEvaluationTemplate() != null ? 
                        exercise.getDefaultEvaluationTemplate().getName() : null)
                .build();
    }

    private ExerciseSummaryResponse mapToExerciseSummary(Exercise exercise) {
        ExerciseSummaryResponse response = new ExerciseSummaryResponse();
        response.setId(exercise.getId());
        response.setName(exercise.getName());
        response.setMinimumDurationMinutes(exercise.getMinimumDurationMinutes());
        response.setFormattedMinimumDuration(TimeCalculator.formatDuration(exercise.getMinimumDurationMinutes()));
        response.setPublic(exercise.isPublic());
        response.setSourceLabel(exercise.isPublic() ? "Public" : "Custom");
        response.setFocusAreas(mapFocusAreas(exercise.getFocusAreas()));
        response.setHasDefaultEvaluationTemplate(exercise.getDefaultEvaluationTemplate() != null);
        
        return response;
    }

    private List<FocusAreaResponse> mapFocusAreas(Set<FocusArea> focusAreas) {
        if (focusAreas == null) return new ArrayList<>();
        
        return focusAreas.stream()
                .map(fa -> {
                    FocusAreaResponse response = new FocusAreaResponse();
                    response.setId(fa.getId());
                    response.setName(fa.getName());
                    response.setDescription(fa.getDescription());
                    response.setColorCode(fa.getColorCode());
                    return response;
                })
                .collect(Collectors.toList());
    }

    private EvaluationTemplate createEvaluationTemplate(ExerciseRequest request, Coach coach) {
        EvaluationTemplate template = new EvaluationTemplate();
        template.setName(request.getEvaluationTemplateName());
        template.setCreatedBy(coach);
        
        // Create criteria from request
        List<EvaluationCriterion> criteria = new ArrayList<>();
        if (request.getEvaluationCriteria() != null) {
            for (ExerciseRequest.EvaluationCriterionRequest criterionRequest : request.getEvaluationCriteria()) {
                EvaluationCriterion criterion = new EvaluationCriterion();
                criterion.setName(criterionRequest.getName());
                criterion.setDescription(criterionRequest.getDescription());
                criterion.setMaxScore(criterionRequest.getMaxScore());
                
                if (criterionRequest.getFocusAreaId() != null) {
                    // Verify focus area exists
                    focusAreaService.getFocusAreaById(criterionRequest.getFocusAreaId())
                            .orElseThrow(() -> new IllegalArgumentException("Focus area not found: " + criterionRequest.getFocusAreaId()));
                    criterion.setFocusAreaId(criterionRequest.getFocusAreaId());
                }
                
                criteria.add(criterion);
            }
        }
        template.setCriteria(criteria);
        
        // Note: The template will be saved when the exercise is saved due to cascade
        return template;
    }
}