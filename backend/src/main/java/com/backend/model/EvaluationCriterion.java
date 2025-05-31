package com.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evaluation_criteria")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationCriterion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_template_id", nullable = false)
    private EvaluationTemplate evaluationTemplate;
    
    @Column(name = "name", nullable = false, length = 50)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "max_score")
    private Integer maxScore = 4;
    
    @Column(name = "focus_area_id")
    private Long focusAreaId;
    
    @Column(name = "order_index")
    private Integer orderIndex = 0;
    
    // Optional: Add ManyToOne relationship to FocusArea if needed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "focus_area_id", insertable = false, updatable = false)
    private FocusArea focusArea;
}