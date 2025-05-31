package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.model.Coach;
// import java.util.List;
import java.util.Optional;


@Repository
public interface CoachRepository extends JpaRepository<Coach, Long>{

    Optional<Coach> findByEmail(String email);
    
}
