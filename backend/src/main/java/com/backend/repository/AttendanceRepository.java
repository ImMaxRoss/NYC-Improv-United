package com.backend.repository;

import com.backend.model.Attendance;
import com.backend.model.PracticeSession;
import com.backend.model.Performer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Attendance.AttendanceId> {
    void deleteByPracticeSessionAndPerformer(PracticeSession session, Performer performer);
    List<Attendance> findByPracticeSessionId(Long sessionId);


    @Modifying
    @Query("DELETE FROM Attendance a WHERE a.practiceSession.id = :sessionId")
    void deleteByPracticeSessionId(@Param("sessionId") Long sessionId);
}