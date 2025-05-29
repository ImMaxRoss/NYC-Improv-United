package com.phas1.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationCriterion {
    private String name;
    private String description;
    private Integer maxScore;
    private Long focusAreaId;
    private Integer orderIndex = 0;
}