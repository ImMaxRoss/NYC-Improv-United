package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SceneEvaluationRequest {

    private Long lessonExerciseId;
    private Long practiceSessionId;
    private List<Long> performerIds;
    private Map<String, Integer> scores;
    private String notes;
    private String rubricType;

}
