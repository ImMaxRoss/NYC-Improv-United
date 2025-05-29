package com.phas1.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coaches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coach_id")
    private Long coachId;

    @Email
    @NotNull(message = "Email cannot be blank.")
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password", length = 255)
    private String password;

    @NotNull(message = "Name cannot be blank.")
    @Column(name = "first_name", nullable = false, length = 30)
    private String firstName;

    @NotNull(message = "Last Name cannot be blank.")
    @Column(name = "last_name", nullable = false, length = 30)
    private String lastName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL)
    private List<Team> teams = new ArrayList<>();

    // ===== NEW ADDITIONS FOR PHASE 1 =====
    
    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL)
    private List<Lesson> lessons = new ArrayList<>();
    
    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL)
    private List<Performer> performers = new ArrayList<>();
    
    // Helper method to get upcoming lessons
    public List<Lesson> getUpcomingLessons() {
        return lessons.stream()
            .filter(lesson -> !lesson.isTemplate())
            .filter(lesson -> lesson.getScheduledDate() != null)
            .filter(lesson -> lesson.getScheduledDate().isAfter(java.time.LocalDateTime.now()))
            .sorted((l1, l2) -> l1.getScheduledDate().compareTo(l2.getScheduledDate()))
            .toList();
    }
    
    // Helper method to get lesson templates
    public List<Lesson> getLessonTemplates() {
        return lessons.stream()
            .filter(Lesson::isTemplate)
            .toList();
    }
    
    // ===== END NEW ADDITIONS =====
}