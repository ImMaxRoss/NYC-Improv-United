package com.phas1.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exercise_evaluations")
public class ExerciseEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "practice_session_id")
    private PracticeSession practiceSession;
    
    @ManyToOne
    @JoinColumn(name = "lesson_exercise_id")
    private LessonExercise lessonExercise;
    
    @ElementCollection
    @CollectionTable(name = "evaluated_performers")
    private Set<Long> performerIds;
    
    @ElementCollection
    @CollectionTable(name = "evaluation_scores")
    private Map<String, Integer> scores = new HashMap<>(); // criterionName -> score
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private LocalDateTime evaluatedAt;
}