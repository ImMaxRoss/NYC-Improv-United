package com.backend.model;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evaluation_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(EvaluationScore.ScoreId.class)
public class EvaluationScore {
    @Id
    @ManyToOne
    @JoinColumn(name = "exercise_evaluation_id", nullable = false)
    private ExerciseEvaluation exerciseEvaluation;
    
    @Id
    @Column(name = "criterion_name", nullable = false)
    private String criterionName;
    
    private int score;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreId implements Serializable {
        private Long exerciseEvaluation;
        private String criterionName;
    }
}