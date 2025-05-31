package com.backend.controller;

import com.backend.dto.PerformerUpdateRequest;
import com.backend.dto.TeamRequest;
import com.backend.dto.TeamResponse;
import com.backend.dto.TeamUpdateRequest;
import com.backend.model.Coach;
import com.backend.service.TeamService;
import com.backend.service.UserService;
import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {
    private final TeamService teamService;
    private final UserService userService;

    // Constructor injection instead of @RequiredArgsConstructor
    public TeamController(TeamService teamService, UserService userService) {
        this.teamService = teamService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(
            @RequestBody @Valid TeamRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Get current user email from authentication
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        
        // Load the coach using email
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
                
        return ResponseEntity.ok(teamService.createTeam(request, coach));
    }
    
    @GetMapping
    public ResponseEntity<List<TeamResponse>> getMyTeams(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
                
        return ResponseEntity.ok(teamService.getTeamsByCoach(coach));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamResponse> updateTeam(
            @PathVariable Long id,
            @RequestBody @Valid TeamUpdateRequest request,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        try {
            TeamResponse response = teamService.updateTeam(id, request, coach);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(
            @PathVariable Long id,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        try {
            teamService.deleteTeam(id, coach);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // ===== NEW ENDPOINTS FOR PHASE 1 =====
    
    @GetMapping("/{id}/performers")
    public ResponseEntity<TeamResponse> getTeamWithPerformers(
            @PathVariable Long id,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        return ResponseEntity.ok(teamService.getTeamWithPerformers(id, coach));
    }
    
    @PutMapping("/{id}/performers")
    public ResponseEntity<TeamResponse> updateTeamPerformers(
            @PathVariable Long id,
            @RequestBody @Valid PerformerUpdateRequest request,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        try {
            TeamResponse response = teamService.updateTeamPerformers(
                id, 
                request.getPerformerIds(), 
                request.getOperation(), 
                coach
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    @PostMapping("/{teamId}/performers/{performerId}")
    public ResponseEntity<Void> addPerformerToTeam(
            @PathVariable Long teamId,
            @PathVariable Long performerId,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        try {
            teamService.addPerformerToTeam(teamId, performerId, coach);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    @DeleteMapping("/{teamId}/performers/{performerId}")
    public ResponseEntity<Void> removePerformerFromTeam(
            @PathVariable Long teamId,
            @PathVariable Long performerId,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        try {
            teamService.removePerformerFromTeam(teamId, performerId, coach);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    // ===== END NEW ADDITIONS =====


}