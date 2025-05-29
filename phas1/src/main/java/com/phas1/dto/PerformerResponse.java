package com.phas1.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PerformerResponse {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String experienceLevel;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Team information
    private List<TeamSummary> teams;
    private Integer teamCount;
    
    // Constructors
    public PerformerResponse() {}
    
    public PerformerResponse(Long id, String firstName, String lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + " " + lastName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { 
        this.firstName = firstName;
        updateFullName();
    }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { 
        this.lastName = lastName;
        updateFullName();
    }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<TeamSummary> getTeams() { return teams; }
    public void setTeams(List<TeamSummary> teams) { 
        this.teams = teams;
        this.teamCount = teams != null ? teams.size() : 0;
    }
    
    public Integer getTeamCount() { return teamCount; }
    public void setTeamCount(Integer teamCount) { this.teamCount = teamCount; }
    
    // Helper methods
    private void updateFullName() {
        if (firstName != null && lastName != null) {
            this.fullName = firstName + " " + lastName;
        }
    }
    
    public boolean hasEmail() {
        return email != null && !email.trim().isEmpty();
    }
    
    // Inner class for team summary
    public static class TeamSummary {
        private Long teamId;
        private String teamName;
        
        public TeamSummary() {}
        
        public TeamSummary(Long teamId, String teamName) {
            this.teamId = teamId;
            this.teamName = teamName;
        }
        
        public Long getTeamId() { return teamId; }
        public void setTeamId(Long teamId) { this.teamId = teamId; }
        
        public String getTeamName() { return teamName; }
        public void setTeamName(String teamName) { this.teamName = teamName; }
    }
}