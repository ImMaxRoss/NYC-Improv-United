package com.phas1.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

public class LessonUpdateRequest {
    
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;
    
    private LocalDateTime scheduledDate;
    
    @Size(max = 50, message = "Workshop type cannot exceed 50 characters")
    private String workshopType;
    
    private Long teamId;
    
    private List<LessonRequest.LessonExerciseRequest> exercises;
    
    // Constructors
    public LessonUpdateRequest() {}
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }
    
    public String getWorkshopType() { return workshopType; }
    public void setWorkshopType(String workshopType) { this.workshopType = workshopType; }
    
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    
    public List<LessonRequest.LessonExerciseRequest> getExercises() { return exercises; }
    public void setExercises(List<LessonRequest.LessonExerciseRequest> exercises) { this.exercises = exercises; }
}