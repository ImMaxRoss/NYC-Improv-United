package com.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long teamId;

    @NotNull(message = "Name cannot be blank.")
    @Column(name = "name", nullable = false, length = 30)
    private String name;

    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Evaluation> evaluations = new ArrayList<>();

    // ===== NEW ADDITIONS FOR PHASE 1 =====
    
    @ManyToMany(mappedBy = "teams")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Performer> performers = new HashSet<>();
    
    @OneToMany(mappedBy = "team")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Lesson> lessons = new ArrayList<>();
    
    // Helper method to add a performer
    public void addPerformer(Performer performer) {
        this.performers.add(performer);
        performer.getTeams().add(this);
    }
    
    // Helper method to remove a performer
    public void removePerformer(Performer performer) {
        this.performers.remove(performer);
        performer.getTeams().remove(this);
    }
    
    // Get active performer count
    public int getActivePerformerCount() {
        return this.performers.size();
    }
    
    // ===== END NEW ADDITIONS =====

    // Existing getter method
    public Long getCoachId() {
        return this.coach != null ? this.coach.getCoachId() : null;
    }
}