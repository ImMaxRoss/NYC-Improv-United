package com.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class LessonResponse {
    
    private Long id;
    private Long coachId;
    private Long teamId;
    private String teamName;
    private String name;
    private LocalDateTime scheduledDate;
    private Integer totalDurationMinutes;
    private String formattedDuration;
    private boolean isTemplate;
    private String workshopType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<LessonExerciseResponse> exercises;
    private Map<String, Integer> focusAreaBreakdown;
    private List<TimeBreakdownResponse> timeBreakdown;
    
    // Constructors
    public LessonResponse() {}
    
    public LessonResponse(Long id, String name, LocalDateTime scheduledDate, Integer totalDurationMinutes) {
        this.id = id;
        this.name = name;
        this.scheduledDate = scheduledDate;
        this.totalDurationMinutes = totalDurationMinutes;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCoachId() { return coachId; }
    public void setCoachId(Long coachId) { this.coachId = coachId; }
    
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }
    
    public Integer getTotalDurationMinutes() { return totalDurationMinutes; }
    public void setTotalDurationMinutes(Integer totalDurationMinutes) { 
        this.totalDurationMinutes = totalDurationMinutes; 
    }
    
    public String getFormattedDuration() { return formattedDuration; }
    public void setFormattedDuration(String formattedDuration) { this.formattedDuration = formattedDuration; }
    
    public boolean isTemplate() { return isTemplate; }
    public void setTemplate(boolean template) { isTemplate = template; }
    
    public String getWorkshopType() { return workshopType; }
    public void setWorkshopType(String workshopType) { this.workshopType = workshopType; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<LessonExerciseResponse> getExercises() { return exercises; }
    public void setExercises(List<LessonExerciseResponse> exercises) { this.exercises = exercises; }
    
    public Map<String, Integer> getFocusAreaBreakdown() { return focusAreaBreakdown; }
    public void setFocusAreaBreakdown(Map<String, Integer> focusAreaBreakdown) { 
        this.focusAreaBreakdown = focusAreaBreakdown; 
    }
    
    public List<TimeBreakdownResponse> getTimeBreakdown() { return timeBreakdown; }
    public void setTimeBreakdown(List<TimeBreakdownResponse> timeBreakdown) { 
        this.timeBreakdown = timeBreakdown; 
    }
    
    // Helper methods
    public int getExerciseCount() {
        return exercises != null ? exercises.size() : 0;
    }
    
    public boolean isScheduled() {
        return scheduledDate != null;
    }
    
    public boolean isUpcoming() {
        return scheduledDate != null && scheduledDate.isAfter(LocalDateTime.now());
    }
    
    // Inner class for lesson exercise responses
    public static class LessonExerciseResponse {
        private Long id;
        private Long exerciseId;
        private String exerciseName;
        private String exerciseDescription;
        private Integer orderIndex;
        private Integer plannedDurationMinutes;
        private String formattedDuration;
        private Long evaluationTemplateId;
        private String evaluationTemplateName;
        private String exerciseNotes;
        private List<FocusAreaResponse> focusAreas;
        
        // Constructors
        public LessonExerciseResponse() {}
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public Long getExerciseId() { return exerciseId; }
        public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }
        
        public String getExerciseName() { return exerciseName; }
        public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
        
        public String getExerciseDescription() { return exerciseDescription; }
        public void setExerciseDescription(String exerciseDescription) { 
            this.exerciseDescription = exerciseDescription; 
        }
        
        public Integer getOrderIndex() { return orderIndex; }
        public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
        
        public Integer getPlannedDurationMinutes() { return plannedDurationMinutes; }
        public void setPlannedDurationMinutes(Integer plannedDurationMinutes) { 
            this.plannedDurationMinutes = plannedDurationMinutes; 
        }
        
        public String getFormattedDuration() { return formattedDuration; }
        public void setFormattedDuration(String formattedDuration) { this.formattedDuration = formattedDuration; }
        
        public Long getEvaluationTemplateId() { return evaluationTemplateId; }
        public void setEvaluationTemplateId(Long evaluationTemplateId) { 
            this.evaluationTemplateId = evaluationTemplateId; 
        }
        
        public String getEvaluationTemplateName() { return evaluationTemplateName; }
        public void setEvaluationTemplateName(String evaluationTemplateName) { 
            this.evaluationTemplateName = evaluationTemplateName; 
        }
        
        public String getExerciseNotes() { return exerciseNotes; }
        public void setExerciseNotes(String exerciseNotes) { this.exerciseNotes = exerciseNotes; }
        
        public List<FocusAreaResponse> getFocusAreas() { return focusAreas; }
        public void setFocusAreas(List<FocusAreaResponse> focusAreas) { this.focusAreas = focusAreas; }
    }
}