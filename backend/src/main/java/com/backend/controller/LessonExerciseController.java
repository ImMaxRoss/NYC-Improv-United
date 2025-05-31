package com.backend.controller;

import com.backend.dto.EvaluationTemplateDTO;
import com.backend.dto.EvaluationTemplateMapper;
import com.backend.service.EvaluationTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lesson-exercises")
@RequiredArgsConstructor
public class LessonExerciseController {

    private final EvaluationTemplateService evaluationTemplateService;

    @GetMapping("/{id}/evaluation-template")
    public ResponseEntity<EvaluationTemplateDTO> getEvaluationTemplate(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(
            EvaluationTemplateMapper.toDTO(
                evaluationTemplateService.resolveTemplateForExercise(id)
            )
        );
    }
}