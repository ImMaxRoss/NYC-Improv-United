package com.phas1.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "practice_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PracticeSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ElementCollection
    @CollectionTable(name = "attendance")
    private Set<Long> presentPerformerIds = new HashSet<>();
    
    @OneToOne
    @JoinColumn(name = "current_exercise_id")
    private LessonExercise currentExercise;
    
    private Integer currentExerciseIndex;

    @OneToMany(mappedBy = "practiceSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PracticeNote> practiceNotes = new ArrayList<>();
}