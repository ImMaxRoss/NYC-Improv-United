package com.backend.model;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(Attendance.AttendanceId.class)
public class Attendance {
    @Id
    @ManyToOne
    @JoinColumn(name = "practice_session_id", nullable = false)
    private PracticeSession practiceSession;
    
    @Id
    @ManyToOne
    @JoinColumn(name = "performer_id", nullable = false)
    private Performer performer;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttendanceId implements Serializable {
        private Long practiceSession;
        private Long performer;
    }
}