package com.phas1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseResponse {
    private Long id;
    private String name;
    private String description;
    private Integer minimumDurationMinutes;
    private String formattedMinimumDuration;
    private boolean isPublic;
    private Long createdByCoachId;
    private String createdByCoachName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<FocusAreaResponse> focusAreas;
    private boolean hasDefaultEvaluationTemplate;
    private String defaultEvaluationTemplateName;
    
    // Usage statistics
    private Integer usageCount;
    private boolean isPopular;
    private boolean isFavorite;

    // Custom methods (Lombok doesn't generate these)
    public boolean hasFocusArea(Long focusAreaId) {
        return focusAreas != null && focusAreas.stream()
            .anyMatch(f -> f.getId().equals(focusAreaId));
    }

    public String getDurationInfo() {
        return formattedMinimumDuration != null ? 
            formattedMinimumDuration : 
            minimumDurationMinutes + " minutes";
    }
}