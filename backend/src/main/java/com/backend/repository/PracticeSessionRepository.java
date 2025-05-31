package com.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.model.PracticeSession;

@Repository
public interface PracticeSessionRepository extends JpaRepository<PracticeSession, Long> {
    List<PracticeSession> findByLessonId(Long lessonId);
    List<PracticeSession> findByLessonIdAndEndTimeIsNull(Long lessonId);
    List<PracticeSession> findByLessonIdAndEndTimeIsNotNull(Long lessonId);

    @Query("SELECT ps FROM PracticeSession ps LEFT JOIN FETCH ps.attendanceRecords WHERE ps.id = :sessionId")
    Optional<PracticeSession> findByIdWithAttendance(@Param("sessionId") Long sessionId);
}
