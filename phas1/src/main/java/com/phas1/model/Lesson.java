package com.phas1.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;
    
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team; // Nullable for non-team lessons
    
    @Column(name = "name")
    private String name; // Custom name or auto-generated
    
    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "total_duration_minutes")
    private Integer totalDurationMinutes;
    
    @Column(name = "is_template")
    private boolean isTemplate;
    
    @Column(name = "workshop_type")
    private String workshopType; // workshop, practice, etc.
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    @OrderBy("orderIndex ASC")
    private List<LessonExercise> exercises = new ArrayList<>();
    
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PracticeNote> practiceNotes = new ArrayList<>();

    public void setIsTemplate(boolean isTemplate) {
        this.isTemplate = isTemplate;
    }
}