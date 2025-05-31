package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PracticeSessionResponse {
    private Long id;
    private Long lessonId;
    private String lessonName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer currentExerciseIndex;
    private Long currentExerciseId;
    private String currentExerciseName;
    private List<Long> attendeeIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}