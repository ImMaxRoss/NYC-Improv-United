package com.backend.controller;

import com.backend.dto.CoachProfileUpdateRequest;
import com.backend.model.Coach;
import com.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {
    
    @Autowired
    private UserService userService;
    
    @PutMapping("/profile")
    public ResponseEntity<Coach> updateProfile(
            @RequestBody @Valid CoachProfileUpdateRequest request,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Get current user email from authentication
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        
        // Load the coach using email
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        // Update the coach profile
        Coach updatedCoach = userService.updateCoachProfile(coach.getCoachId(), request);
        
        // Clear the password field before returning to client
        updatedCoach.setPassword(null);
        
        return ResponseEntity.ok(updatedCoach);
    }
    
    // You could also add a GET endpoint to retrieve the coach profile
    @GetMapping("/profile")
    public ResponseEntity<Coach> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Coach coach = userService.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Coach not found"));
        
        // Clear sensitive information
        coach.setPassword(null);
        
        return ResponseEntity.ok(coach);
    }
}