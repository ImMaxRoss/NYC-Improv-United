package com.backend.controller;

import com.backend.dto.*;
import com.backend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // Record single attendance
    @PostMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> recordAttendance(
            @PathVariable Long sessionId,
            @RequestBody AttendanceRequest request) {
        attendanceService.recordAttendance(sessionId, request);
        return ResponseEntity.ok().build();
    }

    // Bulk attendance update
    @PostMapping("/sessions/{sessionId}/bulk")
    public ResponseEntity<Void> updateBulkAttendance(
            @PathVariable Long sessionId,
            @RequestBody BulkAttendanceRequest request) {
        attendanceService.updateBulkAttendance(sessionId, request);
        return ResponseEntity.ok().build();
    }

    // Get attendees
    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<List<AttendanceResponse>> getAttendees(
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(attendanceService.getAttendees(sessionId));
    }
}