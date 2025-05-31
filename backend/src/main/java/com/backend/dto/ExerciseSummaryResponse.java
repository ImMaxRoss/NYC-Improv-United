package com.backend.dto;

import java.util.List;

public class ExerciseSummaryResponse {
    
    private Long id;
    private String name;
    private Integer minimumDurationMinutes;
    private String formattedMinimumDuration;
    private boolean isPublic;
    private String sourceLabel;
    private List<FocusAreaResponse> focusAreas;
    private boolean hasDefaultEvaluationTemplate;
    
    // Constructors
    public ExerciseSummaryResponse() {}
    
    public ExerciseSummaryResponse(Long id, String name, Integer minimumDurationMinutes) {
        this.id = id;
        this.name = name;
        this.minimumDurationMinutes = minimumDurationMinutes;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Integer getMinimumDurationMinutes() { return minimumDurationMinutes; }
    public void setMinimumDurationMinutes(Integer minimumDurationMinutes) { 
        this.minimumDurationMinutes = minimumDurationMinutes; 
    }
    
    public String getFormattedMinimumDuration() { return formattedMinimumDuration; }
    public void setFormattedMinimumDuration(String formattedMinimumDuration) { 
        this.formattedMinimumDuration = formattedMinimumDuration; 
    }
    
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    
    public String getSourceLabel() { return sourceLabel; }
    public void setSourceLabel(String sourceLabel) { this.sourceLabel = sourceLabel; }
    
    public List<FocusAreaResponse> getFocusAreas() { return focusAreas; }
    public void setFocusAreas(List<FocusAreaResponse> focusAreas) { this.focusAreas = focusAreas; }
    
    public boolean isHasDefaultEvaluationTemplate() { return hasDefaultEvaluationTemplate; }
    public void setHasDefaultEvaluationTemplate(boolean hasDefaultEvaluationTemplate) { 
        this.hasDefaultEvaluationTemplate = hasDefaultEvaluationTemplate; 
    }
}