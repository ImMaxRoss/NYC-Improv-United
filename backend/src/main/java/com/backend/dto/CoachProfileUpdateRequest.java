package com.backend.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoachProfileUpdateRequest {
    private String firstName;
    private String lastName;
    
    @Email
    private String email;
    
    // For future expansion (based on your roadmap)
    private String bio;
    private String experience;
    private String certifications;
    
    // Note: Password updates should be handled separately for security reasons
}