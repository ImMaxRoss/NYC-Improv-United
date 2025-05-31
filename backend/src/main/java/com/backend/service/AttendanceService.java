package com.backend.service;

import com.backend.dto.*;
import com.backend.model.*;
import com.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final PracticeSessionRepository practiceSessionRepository;
    private final PerformerRepository performerRepository;

    // Single attendance record
    @Transactional
    public void recordAttendance(Long sessionId, AttendanceRequest request) {
        PracticeSession session = practiceSessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        
        Performer performer = performerRepository.findById(request.getPerformerId())
            .orElseThrow(() -> new RuntimeException("Performer not found"));

        if (request.isPresent()) {
            attendanceRepository.save(new Attendance(session, performer));
        } else {
            attendanceRepository.deleteByPracticeSessionAndPerformer(session, performer);
        }
    }

    // Bulk attendance update
    @Transactional
    public void updateBulkAttendance(Long sessionId, BulkAttendanceRequest request) {
        PracticeSession session = practiceSessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        // Clear existing attendance for this session
        attendanceRepository.deleteByPracticeSessionId(sessionId);

        // Add new attendance records
        request.getPerformerIds().forEach(performerId -> {
            Performer performer = performerRepository.findById(performerId)
                .orElseThrow(() -> new RuntimeException("Performer not found: " + performerId));
            attendanceRepository.save(new Attendance(session, performer));
        });
    }

	public List<AttendanceResponse> getAttendees(Long sessionId) {
		return attendanceRepository.findByPracticeSessionId(sessionId).stream()
			.map(attendance -> {
				Performer performer = attendance.getPerformer();
				return AttendanceResponse.builder()
					.practiceSessionId(attendance.getPracticeSession().getId())
					.performerId(performer.getId())
					.performerFirstName(performer.getFirstName())  // Updated
					.performerLastName(performer.getLastName())    // Added
					.build();
			})
			.collect(Collectors.toList());
	}
}