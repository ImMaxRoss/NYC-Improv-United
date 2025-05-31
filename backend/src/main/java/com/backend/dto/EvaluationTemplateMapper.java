package com.backend.dto;

import com.backend.model.EvaluationTemplate;
import java.util.stream.Collectors;

public class EvaluationTemplateMapper {
    public static EvaluationTemplateDTO toDTO(EvaluationTemplate template) {
        EvaluationTemplateDTO dto = new EvaluationTemplateDTO();
        dto.setId(template.getId());
        dto.setName(template.getName());
        dto.setDefault(template.isDefault());
        dto.setExerciseId(template.getExercise() != null ? 
            template.getExercise().getId() : null);
        dto.setCreatedByCoachId(template.getCreatedBy() != null ? 
            template.getCreatedBy().getCoachId() : null);
        dto.setCreatedAt(template.getCreatedAt());
        
        dto.setCriteria(template.getCriteria().stream()
            .map(criterion -> {
                CriterionDTO criterionDTO = new CriterionDTO();
                criterionDTO.setName(criterion.getName());
                criterionDTO.setDescription(criterion.getDescription());
                criterionDTO.setMaxScore(criterion.getMaxScore());
                criterionDTO.setFocusAreaId(criterion.getFocusAreaId());
                criterionDTO.setOrderIndex(criterion.getOrderIndex());
                return criterionDTO;
            })
            .collect(Collectors.toList()));
            
        return dto;
    }
}