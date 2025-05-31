package com.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "performers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Performer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Coach coach;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @ManyToMany
    @JoinTable(
        name = "performer_teams",
        joinColumns = @JoinColumn(name = "performer_id"),
        inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Team> teams = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public String getFullName() {
        return firstName + " " + lastName;
    }

}