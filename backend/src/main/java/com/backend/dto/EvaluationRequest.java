package com.backend.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationRequest {
    @NotNull(message = "Team ID is required")
    private Long teamId;

    private LocalDateTime performanceDate;
    
    private String performerNames;
    
    @Min(value = 1, message = "Yes And score must be between 1 and 4")
    @Max(value = 4, message = "Yes And score must be between 1 and 4")
    private Integer yesAnd;
    
    @Min(value = 1, message = "Agreement score must be between 1 and 4")
    @Max(value = 4, message = "Agreement score must be between 1 and 4")
    private Integer agreement;
    
    @Min(value = 1, message = "Who What Where score must be between 1 and 4")
    @Max(value = 4, message = "Who What Where score must be between 1 and 4")
    private Integer whoWhatWhere;
    
    @Min(value = 1, message = "Physicality score must be between 1 and 4")
    @Max(value = 4, message = "Physicality score must be between 1 and 4")
    private Integer physicality;
    
    @Min(value = 1, message = "Listening score must be between 1 and 4")
    @Max(value = 4, message = "Listening score must be between 1 and 4")
    private Integer listening;
    
    @Min(value = 1, message = "Commitment score must be between 1 and 4")
    @Max(value = 4, message = "Commitment score must be between 1 and 4")
    private Integer commitment;
    
    @Min(value = 1, message = "Avoidance of Denial score must be between 1 and 4")
    @Max(value = 4, message = "Avoidance of Denial score must be between 1 and 4")
    private Integer avoidanceOfDenial;
    
    @Min(value = 1, message = "Efficiency score must be between 1 and 4")
    @Max(value = 4, message = "Efficiency score must be between 1 and 4")
    private Integer efficiency;
    
    private String notes;
}