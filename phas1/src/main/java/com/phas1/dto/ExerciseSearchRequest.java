package com.phas1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSearchRequest {
    private String searchTerm;
    private Integer maxDuration;
    private List<Long> focusAreaIds;
    private Boolean publicOnly;
    private Boolean customOnly;
    
    @Builder.Default
    private String sortBy = "name"; // name, duration, popularity, created
    
    @Builder.Default
    private String sortDirection = "asc"; // asc, desc
    
    // Pagination (defaults)
    @Builder.Default
    private Integer page = 0;
    
    @Builder.Default
    private Integer size = 20;
}