package com.phas1.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

// import com.phas1.model.Coach;

@Data
@Builder
public class TeamResponse {
    
    private Long id;
    private String name;
    private String description;
    private Long coachId;  // Links to authenticated coach

    private Integer performerCount;
    private List<PerformerSummary> performers; // Optional, for detailed views
    private Integer upcomingLessonsCount;
    private LocalDateTime nextLessonDate;
    
    // Inner class for performer summary
    @Data
    @Builder
    public static class PerformerSummary {
        private Long id;
        private String firstName;
        private String lastName;
        private String experienceLevel;
    }
}