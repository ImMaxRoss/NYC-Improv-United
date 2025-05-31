package com.backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evaluations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @CreationTimestamp
    @Column(name = "performance_date", nullable = false, updatable = false)
    private LocalDateTime performanceDate;

    @Column(name = "performer_names")
    private String performerNames;

    @Min(1)
    @Max(4)
    @Column(name = "yes_and")
    private Integer yesAnd;

    @Min(1)
    @Max(4)
    @Column(name = "agreement")
    private Integer agreement;

    @Min(1)
    @Max(4)
    @Column(name = "who_what_where")
    private Integer whoWhatWhere;

    @Min(1)
    @Max(4)
    @Column(name = "physicality")
    private Integer physicality;

    @Min(1)
    @Max(4)
    @Column(name = "listening")
    private Integer listening;

    @Min(1)
    @Max(4)
    @Column(name = "commitment")
    private Integer commitment;

    @Min(1)
    @Max(4)
    @Column(name = "avoidance_of_denial")
    private Integer avoidanceOfDenial;

    @Min(1)
    @Max(4)
    @Column(name = "efficiency")
    private Integer efficiency;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    

    // Helper method to get the teamId
    public Long getTeamId() {
        return this.team != null ? this.team.getTeamId() : null;
    }
}