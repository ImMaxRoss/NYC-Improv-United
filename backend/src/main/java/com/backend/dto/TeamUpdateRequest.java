package com.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TeamUpdateRequest {
    @NotBlank(message = "Team name is required")
    private String name;
    
    private String description;  // Optional

    private List<Long> performerIds; // For updating team roster
    private PerformerOperation performerOperation; // ADD, REMOVE, REPLACE
    
    public enum PerformerOperation {
        ADD,      // Add performers to existing roster
        REMOVE,   // Remove specific performers
        REPLACE   // Replace entire roster
    }
}