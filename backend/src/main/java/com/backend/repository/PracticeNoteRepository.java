package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.PracticeNote;

@Repository
public interface PracticeNoteRepository extends JpaRepository<PracticeNote, Long> {
    List<PracticeNote> findByLessonId(Long lessonId);
    List<PracticeNote> findByPracticeSessionId(Long sessionId);
    List<PracticeNote> findByLessonIdAndPracticeSessionId(Long lessonId, Long sessionId);
    List<PracticeNote> findByNoteType(String noteType);
}