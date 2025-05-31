package com.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LessonRequest {
    
    private Long coachId;
    
    private Long teamId; // Optional - for team lessons
    
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;
    
    private LocalDateTime scheduledDate;
    
    @Size(max = 50, message = "Workshop type cannot exceed 50 characters")
    private String workshopType;
    
    private boolean isTemplate = false;
    
    private List<LessonExerciseRequest> exercises;
    
    // Constructors
    public LessonRequest() {}
    
    public LessonRequest(Long coachId, String name, LocalDateTime scheduledDate) {
        this.coachId = coachId;
        this.name = name;
        this.scheduledDate = scheduledDate;
    }
    
    // Getters and Setters
    public Long getCoachId() { return coachId; }
    public void setCoachId(Long coachId) { this.coachId = coachId; }
    
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }
    
    public String getWorkshopType() { return workshopType; }
    public void setWorkshopType(String workshopType) { this.workshopType = workshopType; }
    
    public boolean isTemplate() { return isTemplate; }
    public void setTemplate(boolean template) { isTemplate = template; }
    
    public List<LessonExerciseRequest> getExercises() { return exercises; }
    public void setExercises(List<LessonExerciseRequest> exercises) { this.exercises = exercises; }
    
    // Inner class for exercise requests
    public static class LessonExerciseRequest {
        @NotNull(message = "Exercise ID is required")
        private Long exerciseId;
        
        private Integer plannedDurationMinutes;
        private Long evaluationTemplateId;
        private String exerciseNotes;
        
        // Constructors
        public LessonExerciseRequest() {}
        
        public LessonExerciseRequest(Long exerciseId, Integer plannedDurationMinutes) {
            this.exerciseId = exerciseId;
            this.plannedDurationMinutes = plannedDurationMinutes;
        }
        
        // Getters and Setters
        public Long getExerciseId() { return exerciseId; }
        public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }
        
        public Integer getPlannedDurationMinutes() { return plannedDurationMinutes; }
        public void setPlannedDurationMinutes(Integer plannedDurationMinutes) { 
            this.plannedDurationMinutes = plannedDurationMinutes; 
        }
        
        public Long getEvaluationTemplateId() { return evaluationTemplateId; }
        public void setEvaluationTemplateId(Long evaluationTemplateId) { 
            this.evaluationTemplateId = evaluationTemplateId; 
        }
        
        public String getExerciseNotes() { return exerciseNotes; }
        public void setExerciseNotes(String exerciseNotes) { this.exerciseNotes = exerciseNotes; }
    }
}