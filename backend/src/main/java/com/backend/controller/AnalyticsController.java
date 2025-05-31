package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    // Temporary stub endpoints to prevent 404s
    // TODO: Implement proper analytics logic later
    
    @GetMapping("/performer-progress")
    public ResponseEntity<List<Object>> getPerformerProgress(
            @RequestParam String timeRange,
            @RequestParam(required = false) List<Long> teamIds) {
        
        // Return empty list for now to prevent frontend errors
        return ResponseEntity.ok(Collections.emptyList());
    }
    
    @GetMapping("/coaching-insights") 
    public ResponseEntity<Map<String, Object>> getCoachingInsights(
            @RequestParam String timeRange,
            @RequestParam(required = false) List<Long> teamIds,
            @RequestParam(required = false) List<Long> focusAreaIds) {
        
        // Return minimal data structure to prevent frontend errors
        Map<String, Object> insights = new HashMap<>();
        insights.put("totalPractices", 0);
        insights.put("totalEvaluations", 0);
        insights.put("averageSessionLength", 0);
        insights.put("mostUsedExercises", Collections.emptyList());
        insights.put("teamPerformanceComparison", Collections.emptyList());
        insights.put("overallTeachingEffectiveness", 0.0);
        insights.put("coachingStrengths", Collections.emptyList());
        insights.put("areasForDevelopment", Collections.emptyList());
        insights.put("monthlyActivity", Collections.emptyList());
        
        return ResponseEntity.ok(insights);
    }
    
    @GetMapping("/teams/{teamId}")
    public ResponseEntity<Map<String, Object>> getTeamAnalytics(
            @PathVariable Long teamId,
            @RequestParam String timeRange) {
            
        // Return minimal team analytics structure
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("teamId", teamId);
        analytics.put("teamName", "Team");
        analytics.put("performerCount", 0);
        analytics.put("averageScore", 0.0);
        analytics.put("scoreImprovement", 0.0);
        analytics.put("attendanceRate", 0.0);
        analytics.put("practicesCompleted", 0);
        analytics.put("evaluationsCompleted", 0);
        analytics.put("focusAreaBreakdown", Collections.emptyMap());
        analytics.put("strengthsAndWeaknesses", Map.of(
            "strengths", Collections.emptyList(),
            "weaknesses", Collections.emptyList()
        ));
        analytics.put("progressTrend", Collections.emptyList());
        
        return ResponseEntity.ok(analytics);
    }
}