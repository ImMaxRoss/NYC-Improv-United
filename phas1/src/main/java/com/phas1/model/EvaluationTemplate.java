package com.phas1.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "evaluation_templates")
public class EvaluationTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    private String name;

    @Column(name = "is_default")
    private boolean isDefault = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;
    
    @ElementCollection
    @CollectionTable(name = "evaluation_criteria")
    private List<EvaluationCriterion> criteria = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "created_by_coach_id")
    private Coach createdBy;

    public void setExercise(Exercise exercise) {
        if (exercise == null) {
            if (this.exercise != null) {
                this.exercise.setDefaultEvaluationTemplate(null);
            }
        } else {
            exercise.setDefaultEvaluationTemplate(this);
        }
        this.exercise = exercise;
    }

    
}