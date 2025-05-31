// PerformerService.java
package com.backend.service;

import com.backend.dto.PerformerRequest;
import com.backend.dto.PerformerResponse;
import com.backend.model.Coach;
import com.backend.model.Performer;
import com.backend.repository.PerformerRepository;
import com.backend.util.AuthUtils;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PerformerService {

    private final PerformerRepository performerRepository;
    private final AuthUtils authUtils;


    public PerformerService(PerformerRepository performerRepository, 
                          AuthUtils authUtils) {
        this.performerRepository = performerRepository;
        this.authUtils = authUtils;
    }

    private Coach getAuthenticatedCoach() {
        return authUtils.getCurrentCoach();
    }


    public List<PerformerResponse> getAllPerformers() {
        Coach coach = getAuthenticatedCoach();
        return performerRepository.findByCoachOrderByLastNameAscFirstNameAsc(coach)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PerformerResponse createPerformer(PerformerRequest request) {
        Coach coach = getAuthenticatedCoach();
        Performer performer = new Performer();
        performer.setCoach(coach);
        performer.setFirstName(request.getFirstName());
        performer.setLastName(request.getLastName());
        performer.setEmail(request.getEmail());
        performer.setNotes(request.getNotes());
        
        Performer savedPerformer = performerRepository.save(performer);
        return mapToResponse(savedPerformer);
    }

    public PerformerResponse updatePerformer(Long id, PerformerRequest request) {
        Coach coach = getAuthenticatedCoach();
        Performer performer = performerRepository.findByIdAndCoach(id, coach)
                .orElseThrow(() -> new RuntimeException("Performer not found"));
        
        performer.setFirstName(request.getFirstName());
        performer.setLastName(request.getLastName());
        performer.setEmail(request.getEmail());
        performer.setNotes(request.getNotes());
        
        Performer updatedPerformer = performerRepository.save(performer);
        return mapToResponse(updatedPerformer);
    }

    public void deletePerformer(Long id) {
        Coach coach = getAuthenticatedCoach();
        Performer performer = performerRepository.findByIdAndCoach(id, coach)
                .orElseThrow(() -> new RuntimeException("Performer not found"));
        performerRepository.delete(performer);
    }

    private PerformerResponse mapToResponse(Performer performer) {
        PerformerResponse response = new PerformerResponse();
        response.setId(performer.getId());
        response.setFirstName(performer.getFirstName());
        response.setLastName(performer.getLastName());
        response.setEmail(performer.getEmail());
        response.setNotes(performer.getNotes());
        response.setCreatedAt(performer.getCreatedAt());
        response.setUpdatedAt(performer.getUpdatedAt());
        return response;
    }
}