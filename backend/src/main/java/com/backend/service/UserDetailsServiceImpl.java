package com.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.model.Coach;
import com.backend.config.UserInfoConfig;
import com.backend.repository.CoachRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private CoachRepository coachRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Coach coach = coachRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("Coach not found with email: " + username));

        return new UserInfoConfig(coach);
    }
}