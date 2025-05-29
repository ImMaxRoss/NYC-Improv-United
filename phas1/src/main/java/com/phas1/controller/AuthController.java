package com.phas1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phas1.dto.AuthenticationRequest;
import com.phas1.dto.AuthenticationResponse;
import com.phas1.model.Coach;
import com.phas1.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import com.phas1.service.UserDetailsServiceImpl;
import com.phas1.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Autowired
    private UserService coachService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getEmail(),
                            authenticationRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        // Get coach details for response
        Coach coach = coachService.findByEmail(authenticationRequest.getEmail())
                .orElseThrow(() -> new Exception("Coach not found"));

        return ResponseEntity.ok(new AuthenticationResponse(
                jwt, 
                coach.getEmail(),
                coach.getFirstName(),
                coach.getLastName()
        ));
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerCoach(@RequestBody Coach coach) {
        Coach savedCoach = coachService.registerCoach(coach);
        
        // Generate JWT token for auto-login
        final UserDetails userDetails = userDetailsService.loadUserByUsername(savedCoach.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        return ResponseEntity.ok(new AuthenticationResponse(
                jwt,
                savedCoach.getEmail(),
                savedCoach.getFirstName(),
                savedCoach.getLastName()
        ));
    }

	@PostMapping("/refresh")
	public ResponseEntity<?> refreshToken(HttpServletRequest request) {
		// Extract token from request
		String authHeader = request.getHeader("Authorization");
		String token = authHeader.substring(7);
		
		// Get username from token
		String username = jwtUtil.extractUsername(token);
		
		// Generate new token
		UserDetails userDetails = userDetailsService.loadUserByUsername(username);
		String newToken = jwtUtil.generateToken(userDetails);
		
		// Get coach details
		Coach coach = coachService.findByEmail(username)
				.orElseThrow(() -> new RuntimeException("Coach not found"));
		
		return ResponseEntity.ok(new AuthenticationResponse(
				newToken,
				coach.getEmail(),
				coach.getFirstName(),
				coach.getLastName()
		));
	}
}