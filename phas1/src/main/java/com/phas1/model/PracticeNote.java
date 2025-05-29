package com.phas1.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "practice_notes")
public class PracticeNote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "practice_session_id") // ← THIS WAS MISSING
    private PracticeSession practiceSession;

    @Column(name = "note_type", length = 50)
    private String noteType; // 'overall', 'exercise-specific', etc.

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public PracticeNote() {}

    public PracticeNote(Lesson lesson, String content, String noteType) {
        this.lesson = lesson;
        this.content = content;
        this.noteType = noteType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public Lesson getLesson() { return lesson; }
    public void setLesson(Lesson lesson) { this.lesson = lesson; }
    public PracticeSession getPracticeSession() { return practiceSession; }
    public void setPracticeSession(PracticeSession practiceSession) { this.practiceSession = practiceSession; }
    public String getNoteType() { return noteType; }
    public void setNoteType(String noteType) { this.noteType = noteType; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}