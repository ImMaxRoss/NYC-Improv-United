package com.backend.util;

import com.backend.model.FocusArea;
import com.backend.model.LessonExercise;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class TimeCalculator {

    // === Core Duration Calculations ===
    public int calculateTotalDuration(List<LessonExercise> exercises) {
        if (exercises == null || exercises.isEmpty()) return 0;
        
        return exercises.stream()
            .mapToInt(ex -> ex.getPlannedDurationMinutes() != null ? 
                ex.getPlannedDurationMinutes() : 0)
            .sum();
    }

    // === Focus Area Analysis ===
    public Map<String, Integer> calculateFocusAreaBreakdown(List<LessonExercise> exercises) {
        Map<String, Integer> breakdown = new HashMap<>();
        if (exercises == null) return breakdown;

        exercises.forEach(ex -> {
            if (ex.getPlannedDurationMinutes() == null || ex.getPlannedDurationMinutes() <= 0) return;
            
            List<FocusArea> areas = ex.getExercise() != null && ex.getExercise().getFocusAreas() != null ?
                ex.getExercise().getFocusAreas().stream().collect(Collectors.toList()) :
                List.of();
                
            if (areas.isEmpty()) {
                breakdown.merge("Other", ex.getPlannedDurationMinutes(), Integer::sum);
            } else {
                int timePerArea = ex.getPlannedDurationMinutes() / areas.size();
                areas.forEach(area -> 
                    breakdown.merge(area.getName(), timePerArea, Integer::sum));
            }
        });
        
        return breakdown;
    }

    // === Percentage Breakdown ===
    public static class TimeBreakdown {
        private final int minutes;
        private final double percentage;
        
        public TimeBreakdown(int minutes, double percentage) {
            this.minutes = minutes;
            this.percentage = percentage;
        }
        
        public int getMinutes() { return minutes; }
        public double getPercentage() { return percentage; }
        public String getFormattedPercentage() {
            return String.format("%.1f%%", percentage);
        }
    }

    // === Team Size Adjustment ===
    public int estimateDurationForTeamSize(int baseDuration, int teamSize) {
        return switch (teamSize) {
            case 1, 2, 3, 4 -> (int) (baseDuration * 0.75);
            case 5, 6, 7, 8 -> baseDuration;
            case 9, 10, 11, 12 -> (int) (baseDuration * 1.25);
            default -> (int) (baseDuration * 1.5);
        };
    }

    // === Time Formatting ===
    public static String formatDuration(int minutes) {
        if (minutes < 60) return minutes + " min";
        
        int hours = minutes / 60;
        int mins = minutes % 60;
        
        return mins == 0 ? 
            hours + (hours == 1 ? " hour" : " hours") :
            hours + (hours == 1 ? " hour " : " hours ") + mins + " min";
    }

    // === Scheduling ===
    public LocalDateTime calculateEndTime(LocalDateTime startTime, int durationMinutes) {
        return startTime.plusMinutes(durationMinutes);
    }

	/**
	 * Calculates time spent per focus area with percentages
	 * Returns: Map<FocusAreaName, TimeBreakdown(minutes, percentage)>
	 */
	public Map<String, TimeBreakdown> calculateDetailedTimeBreakdown(List<LessonExercise> exercises) {
		Map<String, Integer> minutesByFocusArea = calculateFocusAreaBreakdown(exercises);
		int totalMinutes = calculateTotalDuration(exercises);

		return minutesByFocusArea.entrySet().stream()
			.collect(Collectors.toMap(
				Map.Entry::getKey,
				entry -> new TimeBreakdown(
					entry.getValue(), // minutes
					totalMinutes > 0 ? 
						(entry.getValue() * 100.0 / totalMinutes) : 0.0 // percentage
				)
			));
	}
    
}