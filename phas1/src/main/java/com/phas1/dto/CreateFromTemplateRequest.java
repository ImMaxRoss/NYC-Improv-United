package com.phas1.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CreateFromTemplateRequest {
    
    @NotNull(message = "Template ID is required")
    private Long templateId;
    
    @NotNull(message = "Scheduled date is required")
    private LocalDateTime scheduledDate;
    
    private String customName;
    private Long teamId;
    
    // Constructors
    public CreateFromTemplateRequest() {}
    
    public CreateFromTemplateRequest(Long templateId, LocalDateTime scheduledDate) {
        this.templateId = templateId;
        this.scheduledDate = scheduledDate;
    }
    
    // Getters and Setters
    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }
    
    public String getCustomName() { return customName; }
    public void setCustomName(String customName) { this.customName = customName; }
    
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
}