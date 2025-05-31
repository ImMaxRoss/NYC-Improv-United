package com.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFromTemplateRequest {
    
    @NotNull(message = "Template ID is required")
    private Long templateId;
    
    @NotNull(message = "Scheduled date is required")
    private LocalDateTime scheduledDate;
    
    private String customName;
    private Long teamId;
}