package com.backend.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description; // Markdown/HTML formatted
    
    @Column(name = "minimum_duration_minutes")
    private Integer minimumDurationMinutes; // For team of 8
    
    @ManyToOne
    @JoinColumn(name = "created_by_coach_id")
    private Coach createdBy; // Null for system exercises
    
    @Column(name = "is_public")
    private boolean isPublic;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToMany
    @JoinTable(
        name = "exercise_focus_areas",
        joinColumns = @JoinColumn(name = "exercise_id"),
        inverseJoinColumns = @JoinColumn(name = "focus_area_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<FocusArea> focusAreas = new HashSet<>();
    
    @OneToOne(mappedBy = "exercise", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private EvaluationTemplate defaultEvaluationTemplate;
}