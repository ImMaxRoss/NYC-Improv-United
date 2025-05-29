package com.phas1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.phas1.model.Coach;
import com.phas1.config.UserInfoConfig;
import com.phas1.repository.CoachRepository;

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