package com.phas1.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.phas1.model.PracticeNote;

@Repository
public interface PracticeNoteRepository extends JpaRepository<PracticeNote, Long> {
    List<PracticeNote> findByLessonId(Long lessonId);
}