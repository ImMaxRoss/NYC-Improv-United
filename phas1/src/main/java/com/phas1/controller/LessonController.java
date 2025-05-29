package com.phas1.controller;

import com.phas1.dto.*;
import com.phas1.dto.LessonResponse.LessonExerciseResponse;
import com.phas1.model.*;
import com.phas1.service.*;
import com.phas1.util.TimeCalculator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
@Tag(name = "Lesson Management", description = "Endpoints for managing improv lessons and practice sessions")
public class LessonController {

    @Autowired
    private LessonService lessonService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private TeamService teamService;
    
    @Autowired
    private ExerciseService exerciseService;
    
    @Autowired
    private TimeCalculator timeCalculator;

    // ===== CREATE OPERATIONS =====

    @PostMapping
    @Operation(summary = "Create a new lesson", description = "Create a new lesson or practice session")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Lesson created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<LessonResponse> createLesson(
            @Valid @RequestBody LessonRequest request,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        // Map request to entity
        Lesson lesson = new Lesson();
        lesson.setName(request.getName());
        lesson.setScheduledDate(request.getScheduledDate());
        lesson.setWorkshopType(request.getWorkshopType());
        lesson.setIsTemplate(request.isTemplate());
        
        // Set team if provided
        if (request.getTeamId() != null) {
        Team team = teamService.getTeamIfOwnedByCoach(request.getTeamId(), coach);
            
            lesson.setTeam(team);
        }
        
        // Map exercises if provided
        if (request.getExercises() != null && !request.getExercises().isEmpty()) {
            List<LessonExercise> lessonExercises = new ArrayList<>();
            for (LessonRequest.LessonExerciseRequest exerciseReq : request.getExercises()) {
                LessonExercise lessonExercise = new LessonExercise();
                
                Exercise exercise = exerciseService.findByIdWithAccess(exerciseReq.getExerciseId(), coach)
                        .orElseThrow(() -> new IllegalArgumentException("Exercise not found or not accessible"));
                
                lessonExercise.setExercise(exercise);
                lessonExercise.setPlannedDurationMinutes(exerciseReq.getPlannedDurationMinutes());
                lessonExercise.setExerciseNotes(exerciseReq.getExerciseNotes());
                lessonExercises.add(lessonExercise);
            }
            lesson.setExercises(lessonExercises);
        }
        
        Lesson savedLesson = lessonService.createLesson(lesson, coach);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToLessonResponse(savedLesson));
    }

    // ===== READ OPERATIONS =====

    @GetMapping("/{id}")
    @Operation(summary = "Get lesson by ID", description = "Retrieve a specific lesson")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lesson found"),
        @ApiResponse(responseCode = "404", description = "Lesson not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<LessonResponse> getLessonById(
            @PathVariable Long id,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        Optional<Lesson> lesson = lessonService.getLessonById(id, coach);
        
        return lesson.map(l -> ResponseEntity.ok(mapToLessonResponse(l)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming lessons", description = "Get all upcoming scheduled lessons")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lessons retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<LessonResponse>> getUpcomingLessons(Authentication authentication) {
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        List<Lesson> lessons = lessonService.getUpcomingLessons(coach);
        
        List<LessonResponse> response = lessons.stream()
                .map(this::mapToLessonResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/templates")
    @Operation(summary = "Get lesson templates", description = "Get all saved lesson templates")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Templates retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<LessonResponse>> getMyTemplates(Authentication authentication) {
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        List<Lesson> templates = lessonService.getMyTemplates(coach);
        
        List<LessonResponse> response = templates.stream()
                .map(this::mapToLessonResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent lessons", description = "Get recent lessons for dashboard")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lessons retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<LessonResponse>> getRecentLessons(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        List<Lesson> lessons = lessonService.getRecentLessons(coach, limit);
        
        List<LessonResponse> response = lessons.stream()
                .map(this::mapToLessonResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // ===== UPDATE OPERATIONS =====

    @PutMapping("/{id}")
    @Operation(summary = "Update lesson", description = "Update an existing lesson")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lesson updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "404", description = "Lesson not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody LessonRequest request,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        // Map request to entity
        Lesson updatedLesson = new Lesson();
        updatedLesson.setName(request.getName());
        updatedLesson.setScheduledDate(request.getScheduledDate());
        updatedLesson.setWorkshopType(request.getWorkshopType());
        
        // Set team if provided
        if (request.getTeamId() != null) {
            Team team = teamService.getTeamIfOwnedByCoach(request.getTeamId(), coach);
            updatedLesson.setTeam(team);
        }
        
        // Map exercises if provided
        if (request.getExercises() != null) {
            List<LessonExercise> lessonExercises = new ArrayList<>();
            for (LessonRequest.LessonExerciseRequest exerciseReq : request.getExercises()) {
                LessonExercise lessonExercise = new LessonExercise();
                
                Exercise exercise = exerciseService.findByIdWithAccess(exerciseReq.getExerciseId(), coach)
                        .orElseThrow(() -> new IllegalArgumentException("Exercise not found or not accessible"));
                
                lessonExercise.setExercise(exercise);
                lessonExercise.setPlannedDurationMinutes(exerciseReq.getPlannedDurationMinutes());
                lessonExercise.setExerciseNotes(exerciseReq.getExerciseNotes());
                lessonExercises.add(lessonExercise);
            }
            updatedLesson.setExercises(lessonExercises);
        }
        
        try {
            Lesson savedLesson = lessonService.updateLesson(id, updatedLesson, coach);
            return ResponseEntity.ok(mapToLessonResponse(savedLesson));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ===== DELETE OPERATIONS =====

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete lesson", description = "Delete a lesson")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Lesson deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Lesson not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long id,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        try {
            lessonService.deleteLesson(id, coach);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ===== TEMPLATE OPERATIONS =====

    @PostMapping("/{id}/save-as-template")
    @Operation(summary = "Save lesson as template", description = "Create a reusable template from an existing lesson")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Template created successfully"),
        @ApiResponse(responseCode = "404", description = "Lesson not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<LessonResponse> saveAsTemplate(
            @PathVariable Long id,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        try {
            Lesson template = lessonService.saveAsTemplate(id, coach);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapToLessonResponse(template));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/templates/{templateId}/create-lesson")
    @Operation(summary = "Create lesson from template", description = "Create a new lesson based on a template")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Lesson created successfully"),
        @ApiResponse(responseCode = "404", description = "Template not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<LessonResponse> createFromTemplate(
            @PathVariable Long templateId,
            @RequestParam LocalDateTime scheduledDate,
            @RequestParam(required = false) String customName,
            @RequestParam(required = false) Long teamId,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        try {
            Lesson lesson = lessonService.createFromTemplate(templateId, scheduledDate, customName, teamId, coach);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapToLessonResponse(lesson));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ===== EXERCISE MANAGEMENT =====

    @PostMapping("/{lessonId}/exercises")
    @Operation(summary = "Add exercise to lesson", description = "Add a new exercise to an existing lesson")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Exercise added successfully"),
        @ApiResponse(responseCode = "404", description = "Lesson or exercise not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<LessonExerciseResponse> addExerciseToLesson(
            @PathVariable Long lessonId,
            @RequestParam Long exerciseId,
            @RequestParam(required = false) Integer duration,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        try {
            LessonExercise lessonExercise = lessonService.addExerciseToLesson(lessonId, exerciseId, duration, coach);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(mapToLessonExerciseResponse(lessonExercise));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{lessonId}/exercises/{lessonExerciseId}")
    @Operation(summary = "Remove exercise from lesson", description = "Remove an exercise from a lesson")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Exercise removed successfully"),
        @ApiResponse(responseCode = "404", description = "Lesson or exercise not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<Void> removeExerciseFromLesson(
            @PathVariable Long lessonId,
            @PathVariable Long lessonExerciseId,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        try {
            lessonService.removeExerciseFromLesson(lessonId, lessonExerciseId, coach);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{lessonId}/exercises/reorder")
    @Operation(summary = "Reorder exercises", description = "Update the order of exercises in a lesson")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Exercises reordered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid exercise list"),
        @ApiResponse(responseCode = "404", description = "Lesson not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<Void> reorderExercises(
            @PathVariable Long lessonId,
            @RequestBody List<Long> exerciseIds,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        try {
            lessonService.reorderExercises(lessonId, exerciseIds, coach);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== ANALYTICS =====

    @GetMapping("/{lessonId}/focus-breakdown")
    @Operation(summary = "Get focus area breakdown", description = "Get time breakdown by focus areas for a lesson")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Breakdown retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Lesson not found"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<List<TimeBreakdownResponse>> getFocusAreaBreakdown(
            @PathVariable Long lessonId,
            Authentication authentication) {
        
        Coach coach = userService.getCurrentCoach(authentication.getName());
        
        try {
            List<Object[]> breakdown = lessonService.getFocusAreaBreakdown(lessonId, coach);
            
            List<TimeBreakdownResponse> response = breakdown.stream()
                    .map(row -> {
                        String focusAreaName = (String) row[0];
                        Long totalMinutes = (Long) row[1];
                        
                        TimeBreakdownResponse tbr = new TimeBreakdownResponse();
                        tbr.setFocusAreaName(focusAreaName);
                        tbr.setMinutes(totalMinutes.intValue());
                        tbr.setFormattedTime(TimeCalculator.formatDuration(totalMinutes.intValue()));
                        
                        return tbr;
                    })
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ===== PRIVATE HELPER METHODS =====

    private LessonResponse mapToLessonResponse(Lesson lesson) {
        LessonResponse response = new LessonResponse();
        response.setId(lesson.getId());
        response.setCoachId(lesson.getCoach().getCoachId());
        response.setTeamId(lesson.getTeam() != null ? lesson.getTeam().getTeamId() : null);
        response.setTeamName(lesson.getTeam() != null ? lesson.getTeam().getName() : null);
        response.setName(lesson.getName());
        response.setScheduledDate(lesson.getScheduledDate());
        response.setTotalDurationMinutes(lesson.getTotalDurationMinutes());
        response.setFormattedDuration(TimeCalculator.formatDuration(lesson.getTotalDurationMinutes() != null ? 
                lesson.getTotalDurationMinutes() : 0));
        response.setTemplate(lesson.isTemplate());
        response.setWorkshopType(lesson.getWorkshopType());
        response.setCreatedAt(lesson.getCreatedAt());
        response.setUpdatedAt(lesson.getUpdatedAt());
        
        // Map exercises
        if (lesson.getExercises() != null) {
            List<LessonResponse.LessonExerciseResponse> exerciseResponses = lesson.getExercises().stream()
                    .map(this::mapToLessonExerciseResponse)
                    .collect(Collectors.toList());
            response.setExercises(exerciseResponses);
            
            // Calculate focus area breakdown
            Map<String, Integer> focusBreakdown = timeCalculator.calculateFocusAreaBreakdown(lesson.getExercises());
            response.setFocusAreaBreakdown(focusBreakdown);
            
            // Calculate time breakdown with percentages
            Map<String, TimeCalculator.TimeBreakdown> detailedBreakdown = 
                    timeCalculator.calculateDetailedTimeBreakdown(lesson.getExercises());
            
            List<TimeBreakdownResponse> timeBreakdownList = detailedBreakdown.entrySet().stream()
                    .map(entry -> new TimeBreakdownResponse(
                            entry.getKey(),
                            null, // colorCode would need to be fetched
                            entry.getValue().getMinutes(),
                            TimeCalculator.formatDuration(entry.getValue().getMinutes()),
                            entry.getValue().getPercentage()
                    ))
                    .collect(Collectors.toList());
            response.setTimeBreakdown(timeBreakdownList);
        }
        
        return response;
    }

    private LessonResponse.LessonExerciseResponse mapToLessonExerciseResponse(LessonExercise lessonExercise) {
        LessonResponse.LessonExerciseResponse response = new LessonResponse.LessonExerciseResponse();
        response.setId(lessonExercise.getId());
        response.setExerciseId(lessonExercise.getExercise().getId());
        response.setExerciseName(lessonExercise.getExercise().getName());
        response.setExerciseDescription(lessonExercise.getExercise().getDescription());
        response.setOrderIndex(lessonExercise.getOrderIndex());
        response.setPlannedDurationMinutes(lessonExercise.getPlannedDurationMinutes());
        response.setFormattedDuration(TimeCalculator.formatDuration(
                lessonExercise.getPlannedDurationMinutes() != null ? 
                lessonExercise.getPlannedDurationMinutes() : 0));
        response.setEvaluationTemplateId(lessonExercise.getEvaluationTemplate() != null ? 
                lessonExercise.getEvaluationTemplate().getId() : null);
        response.setEvaluationTemplateName(lessonExercise.getEvaluationTemplate() != null ? 
                lessonExercise.getEvaluationTemplate().getName() : null);
        response.setExerciseNotes(lessonExercise.getExerciseNotes());
        
        // Map focus areas
        if (lessonExercise.getExercise().getFocusAreas() != null) {
            List<FocusAreaResponse> focusAreas = lessonExercise.getExercise().getFocusAreas().stream()
                    .map(fa -> {
                        FocusAreaResponse far = new FocusAreaResponse();
                        far.setId(fa.getId());
                        far.setName(fa.getName());
                        far.setDescription(fa.getDescription());
                        far.setColorCode(fa.getColorCode());
                        return far;
                    })
                    .collect(Collectors.toList());
            response.setFocusAreas(focusAreas);
        }
        
        return response;
    }
}