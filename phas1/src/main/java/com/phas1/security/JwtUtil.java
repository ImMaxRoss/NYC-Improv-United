package com.phas1.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.phas1.config.JwtProperties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    
    @Autowired
    private JwtProperties jwtProperties;
    
    public String generateToken(UserDetails userDetails) {
        Algorithm algorithm = Algorithm.HMAC256(jwtProperties.getSecret());
        
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withIssuer(jwtProperties.getIssuer())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .sign(algorithm);
    }
    
    public String extractUsername(String token) {
        DecodedJWT jwt = decodeToken(token);
        return jwt != null ? jwt.getSubject() : null;
    }
    
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            DecodedJWT jwt = decodeToken(token);
            if (jwt == null) return false;
            
            final String username = jwt.getSubject();
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwt));
        } catch (Exception e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }
    
    private boolean isTokenExpired(DecodedJWT jwt) {
        Date expirationDate = jwt.getExpiresAt();
        return expirationDate.before(new Date());
    }
    
    private DecodedJWT decodeToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(jwtProperties.getSecret());
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(jwtProperties.getIssuer())
                    .build();
            return verifier.verify(token);
        } catch (JWTVerificationException e) {
            logger.error("JWT verification failed: {}", e.getMessage());
            return null;
        }
    }
}