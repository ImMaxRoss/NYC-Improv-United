package com.phas1.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ExerciseRequest {
    
    @NotBlank(message = "Exercise name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;
    
    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;
    
    @Min(value = 1, message = "Minimum duration must be at least 1 minute")
    private Integer minimumDurationMinutes;
    
    private boolean isPublic = false;
    
    private List<Long> focusAreaIds;
    
    // Evaluation template info
    private String evaluationTemplateName;
    private List<EvaluationCriterionRequest> evaluationCriteria;
    
    // Constructors
    public ExerciseRequest() {}
    
    public ExerciseRequest(String name, String description, Integer minimumDurationMinutes) {
        this.name = name;
        this.description = description;
        this.minimumDurationMinutes = minimumDurationMinutes;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getMinimumDurationMinutes() { return minimumDurationMinutes; }
    public void setMinimumDurationMinutes(Integer minimumDurationMinutes) { 
        this.minimumDurationMinutes = minimumDurationMinutes; 
    }
    
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    
    public List<Long> getFocusAreaIds() { return focusAreaIds; }
    public void setFocusAreaIds(List<Long> focusAreaIds) { this.focusAreaIds = focusAreaIds; }
    
    public String getEvaluationTemplateName() { return evaluationTemplateName; }
    public void setEvaluationTemplateName(String evaluationTemplateName) { 
        this.evaluationTemplateName = evaluationTemplateName; 
    }
    
    public List<EvaluationCriterionRequest> getEvaluationCriteria() { return evaluationCriteria; }
    public void setEvaluationCriteria(List<EvaluationCriterionRequest> evaluationCriteria) { 
        this.evaluationCriteria = evaluationCriteria; 
    }
    
    // Inner class for evaluation criteria
    public static class EvaluationCriterionRequest {
        @NotBlank(message = "Criterion name is required")
        private String name;
        
        private String description;
        
        @Min(value = 1, message = "Max score must be at least 1")
        private Integer maxScore = 4;
        
        private Long focusAreaId;
        
        // Constructors
        public EvaluationCriterionRequest() {}
        
        public EvaluationCriterionRequest(String name, String description, Integer maxScore) {
            this.name = name;
            this.description = description;
            this.maxScore = maxScore;
        }
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public Integer getMaxScore() { return maxScore; }
        public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
        
        public Long getFocusAreaId() { return focusAreaId; }
        public void setFocusAreaId(Long focusAreaId) { this.focusAreaId = focusAreaId; }
    }
}