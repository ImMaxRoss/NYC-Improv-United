package com.backend.dto;


public class FocusAreaResponse {
    
    private Long id;
    private String name;
    private String description;
    private String colorCode;
    
    // Constructors
    public FocusAreaResponse() {}
    
    public FocusAreaResponse(Long id, String name, String colorCode) {
        this.id = id;
        this.name = name;
        this.colorCode = colorCode;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }
}