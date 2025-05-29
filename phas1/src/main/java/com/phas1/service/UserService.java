package com.phas1.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.phas1.dto.CoachProfileUpdateRequest;
import com.phas1.model.Coach;
import com.phas1.repository.CoachRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private CoachRepository coachRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public String getCurrentUserEmail() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString(); 
        }

    }

    public Coach registerCoach(Coach coach) {
        coach.setPassword(passwordEncoder.encode(coach.getPassword()));
        return coachRepository.save(coach);
    }
    
    public Optional<Coach> findByEmail(String email) {
        return coachRepository.findByEmail(email);
    }
    
    public Coach getCurrentCoach(String email) {
        return coachRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Coach not found with email: " + email));
    }

    @Transactional
    public Coach updateCoachProfile(Long coachId, CoachProfileUpdateRequest request) {
        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach not found with id: " + coachId));
        
        // Only update fields that are not null in the request
        if (request.getFirstName() != null) {
            coach.setFirstName(request.getFirstName());
        }
        
        if (request.getLastName() != null) {
            coach.setLastName(request.getLastName());
        }
        
        if (request.getEmail() != null) {
            // Check if email is already taken by another user
            boolean emailExists = coachRepository.findByEmail(request.getEmail())
                    .map(c -> !c.getCoachId().equals(coachId)) // True if found coach is not the current coach
                    .orElse(false);
                    
            if (emailExists) {
                throw new IllegalArgumentException("Email is already in use");
            }
            
            coach.setEmail(request.getEmail());
        }
        
        // Future fields to potentially add based on your roadmap
        // if (request.getBio() != null) coach.setBio(request.getBio());
        // if (request.getExperience() != null) coach.setExperience(request.getExperience());
        // if (request.getCertifications() != null) coach.setCertifications(request.getCertifications());
        
        return coachRepository.save(coach);
    }

}
