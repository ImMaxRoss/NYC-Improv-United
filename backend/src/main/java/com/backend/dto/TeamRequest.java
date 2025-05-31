package com.backend.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TeamRequest {
    @NotBlank(message = "Team name is required")
    private String name;
    
    private String description;  // Optional

}