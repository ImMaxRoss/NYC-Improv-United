package com.backend.controller;

import com.backend.dto.EvaluationRequest;
import com.backend.dto.EvaluationResponse;
import com.backend.dto.EvaluationUpdateRequest;
import com.backend.model.Coach;
import com.backend.service.EvaluationService;
import com.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {
    private final EvaluationService evaluationService;
    private final UserService userService;
    
    public EvaluationController(EvaluationService evaluationService, UserService userService) {
        this.evaluationService = evaluationService;
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<EvaluationResponse> createEvaluation(
            @RequestBody @Valid EvaluationRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Get current user email from authentication
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        
        // Load the coach using email
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
                
        return ResponseEntity.ok(evaluationService.createEvaluation(request, coach));
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<EvaluationResponse>> getEvaluationsByTeam(
            @PathVariable Long teamId,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
                
        return ResponseEntity.ok(evaluationService.getEvaluationsByTeam(teamId, coach));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EvaluationResponse> getEvaluationById(
            @PathVariable Long id,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
                
        return ResponseEntity.ok(evaluationService.getEvaluationById(id, coach));
    }
    
    @GetMapping
    public ResponseEntity<List<EvaluationResponse>> getAllMyEvaluations(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
                
        return ResponseEntity.ok(evaluationService.getAllEvaluationsByCoach(coach));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvaluationResponse> updateEvaluation(
            @PathVariable Long id,
            @RequestBody @Valid EvaluationUpdateRequest request,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        try {
            EvaluationResponse response = evaluationService.updateEvaluation(id, request, coach);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluation(
            @PathVariable Long id,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        try {
            evaluationService.deleteEvaluation(id, coach);
            return ResponseEntity.noContent().build(); // Return 204 No Content on successful deletion
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/export/{teamId}")
    public ResponseEntity<List<EvaluationResponse>> exportEvaluationsForTeam(
            @PathVariable Long teamId,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            Authentication authentication) {
        // Authentication check
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        // Get evaluations with optional date filtering
        List<EvaluationResponse> evaluations = evaluationService.getEvaluationsByTeamAndDateRange(
                teamId, startDate, endDate, coach);
        
        return ResponseEntity.ok(evaluations);
    }

}