package com.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lesson_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
    
    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;
    
    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "planned_duration_minutes")
    private Integer plannedDurationMinutes;
    
    @ManyToOne
    @JoinColumn(name = "evaluation_template_id")
    private EvaluationTemplate evaluationTemplate; // Can override default
    
    @OneToMany(mappedBy = "lessonExercise", cascade = CascadeType.ALL)
    private List<ExerciseEvaluation> evaluations = new ArrayList<>();

    
    @Column(columnDefinition = "TEXT")
    private String exerciseNotes;
}