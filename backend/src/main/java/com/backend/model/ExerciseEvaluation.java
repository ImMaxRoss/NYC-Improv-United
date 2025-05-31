package com.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;


@Entity
@Data
@Builder
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
    
    @ManyToMany
    @JoinTable(
        name = "evaluation_performers",
        joinColumns = @JoinColumn(name = "evaluation_id"),
        inverseJoinColumns = @JoinColumn(name = "performer_id")
    )
    private Set<Performer> evaluatedPerformers;
    
    @OneToMany(mappedBy = "exerciseEvaluation", cascade = CascadeType.ALL)
    @Builder.Default
    private List<EvaluationScore> evaluationScores = new ArrayList<>();
        
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private LocalDateTime evaluatedAt;
}