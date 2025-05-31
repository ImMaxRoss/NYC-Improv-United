package com.backend.util;

import com.backend.model.Coach;
import com.backend.repository.CoachRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtils {
    
    private final CoachRepository coachRepository;

    public AuthUtils(CoachRepository coachRepository) {
        this.coachRepository = coachRepository;
    }

    public String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public Coach getCurrentCoach() {
        String email = getCurrentUserEmail();
        return coachRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Coach not found"));
    }
}