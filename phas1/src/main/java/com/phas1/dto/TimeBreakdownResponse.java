package com.phas1.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeBreakdownResponse {
    private String focusAreaName;
    private String colorCode;
    private Integer minutes;
    private String formattedTime;
    private Double percentage;
    
    // Computed property (not stored)
    public String getFormattedPercentage() {
        return percentage != null ? String.format("%.1f%%", percentage) : "0%";
    }
}