package com.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EvaluationTemplateDTO {
    private Long id;
    private String name;
    private boolean isDefault;
    private Long exerciseId;
    private Long createdByCoachId;
    private LocalDateTime createdAt;
    private List<CriterionDTO> criteria;
}

@Data
class CriterionDTO {
    private String name;
    private String description;
    private int maxScore;
    private Long focusAreaId;
    private int orderIndex;
}