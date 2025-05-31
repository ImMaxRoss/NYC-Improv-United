package com.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerformerUpdateRequest {
    @NotNull
    private List<Long> performerIds;
    
    @NotNull
    private TeamUpdateRequest.PerformerOperation operation;
}