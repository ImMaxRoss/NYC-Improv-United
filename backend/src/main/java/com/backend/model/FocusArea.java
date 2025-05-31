package com.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "focus_areas")
public class FocusArea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    private String name; // "Yes And", "Agreement", "Who/What/Where", etc.
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "color_code")
    private String colorCode; // For UI visualization
    
    // Bidirectional relationship with Exercise
    @ManyToMany(mappedBy = "focusAreas")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore // Prevent circular reference in JSON serialization
    private Set<Exercise> exercises = new HashSet<>();
}