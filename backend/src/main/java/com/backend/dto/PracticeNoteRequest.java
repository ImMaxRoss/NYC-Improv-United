package com.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PracticeNoteRequest {

    private Long lessonId;
    private Long sessionId;
    private String noteType;
    private String content;

}
