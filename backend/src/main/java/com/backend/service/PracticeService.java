package com.backend.service;

import com.backend.dto.SceneEvaluationRequest;
import com.backend.dto.SceneEvaluationResponse;
import com.backend.model.*;
import com.backend.repository.*;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PracticeService {

    private final PracticeSessionRepository practiceSessionRepository;
    private final LessonRepository lessonRepository;
    private final LessonExerciseRepository lessonExerciseRepository;
    private final ExerciseEvaluationRepository exerciseEvaluationRepository;
    private final PerformerRepository performerRepository;
    private final AttendanceRepository attendanceRepository;
    private final PracticeNoteRepository practiceNoteRepository;

    @Transactional
    public PracticeSession startPracticeSession(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
        
        PracticeSession session = PracticeSession.builder()
                .lesson(lesson)
                .startTime(LocalDateTime.now())
                .currentExerciseIndex(0)
                .build();
        
        // Set first exercise if exists
        lessonExerciseRepository.findByLessonOrderByOrderIndexAsc(lesson)
                .stream()
                .findFirst()
                .ifPresent(session::setCurrentExercise);
        
        return practiceSessionRepository.save(session);
    }


    public PracticeSession endPracticeSession(Long sessionId) {
        PracticeSession session = practiceSessionRepository.findByIdWithAttendance(sessionId)
            .orElseThrow(() -> new EntityNotFoundException("Session not found"));
        
        session.setEndTime(LocalDateTime.now());
        return practiceSessionRepository.save(session);
    }

    @Transactional
    public PracticeSession updateCurrentExercise(Long sessionId, Long exerciseId) {
        PracticeSession session = practiceSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Practice session not found"));
        
        LessonExercise exercise = lessonExerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        session.setCurrentExercise(exercise);
        
        // Update current exercise index
        int index = lessonExerciseRepository.findByLessonOrderByOrderIndexAsc(session.getLesson())
                .indexOf(exercise);
        session.setCurrentExerciseIndex(index >= 0 ? index : 0);
        
        return practiceSessionRepository.save(session);
    }

    @Transactional
    public Attendance recordAttendance(Long sessionId, Long performerId, boolean isPresent) {
        PracticeSession session = practiceSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Practice session not found"));
        
        Performer performer = performerRepository.findById(performerId)
                .orElseThrow(() -> new IllegalArgumentException("Performer not found"));
        
        if (isPresent) {
            Attendance attendance = new Attendance(session, performer);
            return attendanceRepository.save(attendance);
        } else {
            attendanceRepository.deleteByPracticeSessionAndPerformer(session, performer);
            return null;
        }
    }

    @Transactional
    public List<Performer> getAttendees(Long sessionId) {
        return attendanceRepository.findByPracticeSessionId(sessionId)
                .stream()
                .map(Attendance::getPerformer)
                .collect(Collectors.toList());
    }

	@Transactional
	public void updateBulkAttendance(Long sessionId, List<Long> performerIds) {
		PracticeSession session = practiceSessionRepository.findById(sessionId)
				.orElseThrow(() -> new IllegalArgumentException("Practice session not found"));
		
		// Clear existing attendance records for this session
		attendanceRepository.deleteByPracticeSessionId(sessionId);
		
		// Add new attendance records for selected performers
		if (performerIds != null && !performerIds.isEmpty()) {
			for (Long performerId : performerIds) {
				Performer performer = performerRepository.findById(performerId)
						.orElseThrow(() -> new IllegalArgumentException("Performer not found: " + performerId));
				
				Attendance attendance = new Attendance(session, performer);
				attendanceRepository.save(attendance);
			}
		}
	}

    @Transactional
    public SceneEvaluationResponse evaluateScene(SceneEvaluationRequest request) {
        LessonExercise lessonExercise = lessonExerciseRepository.findById(request.getLessonExerciseId())
                .orElseThrow(() -> new IllegalArgumentException("Lesson exercise not found"));
        
        PracticeSession practiceSession = null;
        if (request.getPracticeSessionId() != null) {
            practiceSession = practiceSessionRepository.findById(request.getPracticeSessionId())
                    .orElseThrow(() -> new IllegalArgumentException("Practice session not found"));
        }
    
    // Create evaluation
    ExerciseEvaluation evaluation = ExerciseEvaluation.builder()
            .lessonExercise(lessonExercise)
            .practiceSession(practiceSession)
            .notes(request.getNotes())
            .evaluatedAt(LocalDateTime.now())
            .build();
    
    // Set performers - fixed this section
    Set<Performer> performers = request.getPerformerIds().stream()
            .map(id -> performerRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Performer not found with id: " + id)))
            .collect(Collectors.toSet());
    evaluation.setEvaluatedPerformers(performers);
    
    // Save evaluation first to get ID
    ExerciseEvaluation savedEvaluation = exerciseEvaluationRepository.save(evaluation);
    
    // Create scores
    List<EvaluationScore> scores = request.getScores().entrySet().stream()
            .map(entry -> new EvaluationScore(savedEvaluation, entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());
    savedEvaluation.setEvaluationScores(scores);
    
    // Update and return
    ExerciseEvaluation updatedEvaluation = exerciseEvaluationRepository.save(savedEvaluation);
    
    return SceneEvaluationResponse.builder()
            .id(updatedEvaluation.getId())
            .lessonExerciseId(updatedEvaluation.getLessonExercise().getId())
            .practiceSessionId(updatedEvaluation.getPracticeSession() != null ? 
                updatedEvaluation.getPracticeSession().getId() : null)
            .performerIds(updatedEvaluation.getEvaluatedPerformers().stream()
                .map(Performer::getId)
                .collect(Collectors.toList()))
            .scores(updatedEvaluation.getEvaluationScores().stream()
                .collect(Collectors.toMap(
                    EvaluationScore::getCriterionName, 
                    EvaluationScore::getScore)))
            .notes(updatedEvaluation.getNotes())
            .rubricType(request.getRubricType())
            .build();
}

    @Transactional
    public PracticeNote addPracticeNote(Long lessonId, Long sessionId, String noteType, String content) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
        
        PracticeSession session = null;
        if (sessionId != null) {
            session = practiceSessionRepository.findById(sessionId)
                    .orElseThrow(() -> new IllegalArgumentException("Practice session not found"));
        }
        
        PracticeNote note = PracticeNote.builder()
                .lesson(lesson)
                .practiceSession(session)
                .noteType(noteType)
                .content(content)
                .build();
        
        return practiceNoteRepository.save(note);
    }

    @Transactional
    public List<PracticeNote> getPracticeNotes(Long lessonId, Long sessionId) {
        if (sessionId != null) {
            return practiceNoteRepository.findByLessonIdAndPracticeSessionId(lessonId, sessionId);
        } else {
            return practiceNoteRepository.findByLessonId(lessonId);
        }
    }

    @Transactional
    public List<ExerciseEvaluation> getEvaluationsForSession(Long sessionId) {
        return exerciseEvaluationRepository.findByPracticeSessionId(sessionId);
    }

    @Transactional
    public List<ExerciseEvaluation> getEvaluationsForExercise(Long lessonExerciseId) {
        return exerciseEvaluationRepository.findByLessonExerciseId(lessonExerciseId);
    }
}