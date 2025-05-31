// Updated PracticeController.java - Replace the existing one

package com.backend.controller;

import com.backend.dto.*;
import com.backend.model.ExerciseEvaluation;
// import com.backend.model.Performer;
import com.backend.model.PracticeNote;
import com.backend.model.PracticeSession;
import com.backend.service.PracticeService;
import lombok.RequiredArgsConstructor;

import org.hibernate.Hibernate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final PracticeService practiceService;

    // Session Management Endpoints
    @PostMapping("/sessions")
    public ResponseEntity<PracticeSessionResponse> startPracticeSession(
            @RequestBody PracticeSessionRequest request) {
        PracticeSession session = practiceService.startPracticeSession(request.getLessonId());
        return ResponseEntity.ok(mapToResponse(session));
    }

    @PutMapping("/sessions/{sessionId}/end")
    public ResponseEntity<PracticeSessionResponse> endPracticeSession(
            @PathVariable Long sessionId) {
        PracticeSession session = practiceService.endPracticeSession(sessionId);
        return ResponseEntity.ok(mapToResponse(session));
    }

    @PutMapping("/sessions/{sessionId}/exercise")
    public ResponseEntity<PracticeSessionResponse> updateCurrentExercise(
            @PathVariable Long sessionId,
            @RequestBody Map<String, Long> request) {
        PracticeSession session = practiceService.updateCurrentExercise(
            sessionId, 
            request.get("exerciseId")
        );
        return ResponseEntity.ok(mapToResponse(session));
    }

    // Evaluation Endpoints
    @PostMapping("/evaluations")
    public ResponseEntity<SceneEvaluationResponse> evaluateScene(
            @RequestBody SceneEvaluationRequest request) {
        SceneEvaluationResponse response = practiceService.evaluateScene(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions/{sessionId}/evaluations")
    public ResponseEntity<List<ExerciseEvaluation>> getSessionEvaluations(
            @PathVariable Long sessionId) {
        List<ExerciseEvaluation> evaluations = 
            practiceService.getEvaluationsForSession(sessionId);
        return ResponseEntity.ok(evaluations);
    }

    @GetMapping("/exercises/{exerciseId}/evaluations")
    public ResponseEntity<List<ExerciseEvaluation>> getExerciseEvaluations(
            @PathVariable Long exerciseId) {
        List<ExerciseEvaluation> evaluations = 
            practiceService.getEvaluationsForExercise(exerciseId);
        return ResponseEntity.ok(evaluations);
    }


    // Practice Notes Endpoints
    @PostMapping("/notes")
    public ResponseEntity<PracticeNoteResponse> addPracticeNote(
            @RequestBody PracticeNoteRequest request) {
        PracticeNote note = practiceService.addPracticeNote(
            request.getLessonId(),
            request.getSessionId(),
            request.getNoteType(),
            request.getContent()
        );
        return ResponseEntity.ok(mapToResponse(note));
    }



    @GetMapping("/notes")
    public ResponseEntity<List<PracticeNoteResponse>> getPracticeNotes(
            @RequestParam Long lessonId,
            @RequestParam(required = false) Long sessionId) {
        List<PracticeNote> notes = practiceService.getPracticeNotes(lessonId, sessionId);
        List<PracticeNoteResponse> responses = notes.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Helper mapping methods to convert entities to DTOs
    private PracticeSessionResponse mapToResponse(PracticeSession session) {
        // Handle attendanceRecords safely
        List<Long> attendeeIds = new ArrayList<>();
        if (session.getAttendanceRecords() != null && Hibernate.isInitialized(session.getAttendanceRecords())) {
            attendeeIds = session.getAttendanceRecords().stream()
                .map(a -> a.getPerformer().getId())
                .collect(Collectors.toList());
        }
        
        return PracticeSessionResponse.builder()
            .id(session.getId())
            // ... other fields
            .attendeeIds(attendeeIds) // Use pre-collected list
            .build();
    }

    private PracticeNoteResponse mapToResponse(PracticeNote note) {
        return PracticeNoteResponse.builder()
            .id(note.getId())
            .lessonId(note.getLesson() != null ? note.getLesson().getId() : null)
            .practiceSessionId(note.getPracticeSession() != null ? note.getPracticeSession().getId() : null)
            .noteType(note.getNoteType())
            .content(note.getContent())
            .createdAt(note.getCreatedAt())
            .build();
    }

}