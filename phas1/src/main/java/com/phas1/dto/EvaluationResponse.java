package com.phas1.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EvaluationResponse {
    private Long id;
    private Long teamId;
    private LocalDateTime performanceDate;
    private String teamName;
    private String performerNames;
    private Integer yesAnd;
    private Integer agreement;
    private Integer whoWhatWhere;
    private Integer physicality;
    private Integer listening;
    private Integer commitment;
    private Integer avoidanceOfDenial;
    private Integer efficiency;
    private String notes;
    
}