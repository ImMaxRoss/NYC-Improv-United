package com.backend.service;

import com.backend.model.EvaluationTemplate;
import com.backend.model.LessonExercise;
import com.backend.repository.EvaluationTemplateRepository;
import com.backend.repository.LessonExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class EvaluationTemplateService {

    private final LessonExerciseRepository lessonExerciseRepository;
    private final EvaluationTemplateRepository evaluationTemplateRepository;

    public EvaluationTemplate resolveTemplateForExercise(Long lessonExerciseId) {
        LessonExercise lessonExercise = lessonExerciseRepository.findById(lessonExerciseId)
            .orElseThrow(() -> new EntityNotFoundException("LessonExercise not found"));

        // 1. Check lesson-exercise specific override
        if (lessonExercise.getEvaluationTemplate() != null) {
            return lessonExercise.getEvaluationTemplate();
        }

        // 2. Use exercise's default template
        if (lessonExercise.getExercise() != null && lessonExercise.getExercise().getDefaultEvaluationTemplate() != null) {
            return lessonExercise.getExercise().getDefaultEvaluationTemplate();
        }

        // 3. Fallback to system default (if implemented)
        return evaluationTemplateRepository.findByIsDefaultTrue()
            .orElseThrow(() -> new EntityNotFoundException("No template found"));
    }
}