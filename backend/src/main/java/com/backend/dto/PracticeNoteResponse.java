package com.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PracticeNoteResponse {
    private Long id;
    private Long lessonId;
    private Long practiceSessionId;
    private String noteType;
    private String content;
    private LocalDateTime createdAt;
}
