package com.phas1.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PerformerUpdateRequest {
    @NotNull
    private List<Long> performerIds;
    
    @NotNull
    private TeamUpdateRequest.PerformerOperation operation;
}