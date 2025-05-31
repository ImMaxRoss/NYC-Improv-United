package com.backend.service;

import com.backend.dto.TeamRequest;
import com.backend.dto.TeamResponse;
import com.backend.dto.TeamUpdateRequest;
import com.backend.model.Coach;
import com.backend.model.Performer;
import com.backend.model.Team;
import com.backend.repository.PerformerRepository;
import com.backend.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final PerformerRepository performerRepository;

	@Transactional
	public TeamResponse createTeam(TeamRequest request, Coach coach) {
		if (coach == null) {
			throw new IllegalArgumentException("Coach must be authenticated");
		}

		// Add debugging
		System.out.println("Creating team with name: " + request.getName());
		System.out.println("Description: " + request.getDescription());
		System.out.println("Coach ID: " + coach.getCoachId());

		Team team = new Team();
		team.setName(request.getName());
		team.setDescription(request.getDescription());
		team.setCoach(coach);
		
		Team savedTeam = teamRepository.save(team);
		return mapToResponse(savedTeam);
	}

    public List<TeamResponse> getTeamsByCoach(Coach coach) {
        return teamRepository.findByCoachIdWithPerformers(coach.getCoachId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Use your existing repository method
    public boolean isTeamOwnedByCoach(Long teamId, Coach coach) {
        Long actualCoachId = teamRepository.findTeamId(teamId);
        return actualCoachId != null && actualCoachId.equals(coach.getCoachId());
    }
    
    // Add this convenience method
    public Team getTeamIfOwnedByCoach(Long teamId, Coach coach) {
        if (isTeamOwnedByCoach(teamId, coach)) {
            return teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        }
        throw new IllegalArgumentException("Team not owned by coach");
    }


    // Updated mapping method
    private TeamResponse mapToResponse(Team team) {
        return TeamResponse.builder()
                .id(team.getTeamId())
                .name(team.getName())
                .description(team.getDescription())
                .coachId(team.getCoach().getCoachId())
                .performerCount(team.getActivePerformerCount()) // NEW
                .build();
    }

    // ===== NEW METHODS FOR PHASE 1 =====
    
    @Transactional
    public TeamResponse getTeamWithPerformers(Long teamId, Coach coach) {
        Team team = teamRepository.findByIdWithPerformers(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        
        if (!team.getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to view this team");
        }
        
        return mapToDetailedResponse(team);
    }
    
    @Transactional
    public TeamResponse updateTeamPerformers(Long teamId, List<Long> performerIds, 
            TeamUpdateRequest.PerformerOperation operation, Coach coach) {
        
        Team team = teamRepository.findByIdWithPerformers(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        
        if (!team.getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to update this team");
        }
        
        // Validate performers belong to coach
        List<Performer> performers = performerRepository.findAllById(performerIds);
        for (Performer performer : performers) {
            if (!performer.getCoach().getCoachId().equals(coach.getCoachId())) {
                throw new IllegalArgumentException("Performer " + performer.getId() + 
                    " does not belong to this coach");
            }
        }
        
        switch (operation) {
            case ADD:
                performers.forEach(team::addPerformer);
                break;
            case REMOVE:
                performers.forEach(team::removePerformer);
                break;
            case REPLACE:
                // Clear existing performers
                new ArrayList<>(team.getPerformers()).forEach(team::removePerformer);
                // Add new performers
                performers.forEach(team::addPerformer);
                break;
        }
        
        Team savedTeam = teamRepository.save(team);
        return mapToDetailedResponse(savedTeam);
    }
    
    @Transactional
    public void addPerformerToTeam(Long teamId, Long performerId, Coach coach) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        
        if (!team.getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to update this team");
        }
        
        Performer performer = performerRepository.findById(performerId)
                .orElseThrow(() -> new IllegalArgumentException("Performer not found"));
        
        if (!performer.getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Performer does not belong to this coach");
        }
        
        team.addPerformer(performer);
        teamRepository.save(team);
    }
    
    @Transactional
    public void removePerformerFromTeam(Long teamId, Long performerId, Coach coach) {
        Team team = teamRepository.findByIdWithPerformers(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        
        if (!team.getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to update this team");
        }
        
        Performer performer = team.getPerformers().stream()
                .filter(p -> p.getId().equals(performerId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Performer not in team"));
        
        team.removePerformer(performer);
        teamRepository.save(team);
    }
    
    private TeamResponse mapToDetailedResponse(Team team) {
        List<TeamResponse.PerformerSummary> performerSummaries = team.getPerformers().stream()
                .map(p -> TeamResponse.PerformerSummary.builder()
                        .id(p.getId())
                        .firstName(p.getFirstName())
                        .lastName(p.getLastName())
                        .build())
                .collect(Collectors.toList());
        
        return TeamResponse.builder()
                .id(team.getTeamId())
                .name(team.getName())
                .description(team.getDescription())
                .coachId(team.getCoach().getCoachId())
                .performerCount(team.getActivePerformerCount())
                .performers(performerSummaries)
                .build();
    }
    
    // ===== END NEW ADDITIONS =====

    @Transactional
    public TeamResponse updateTeam(Long teamId, TeamUpdateRequest request, Coach coach) {
        // Find the team
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + teamId));
        
        // Verify the coach owns the team
        if (!team.getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to update this team");
        }
        
        // Check if the new name conflicts with another team owned by this coach
        if (!team.getName().equals(request.getName()) && 
            teamRepository.existsByNameAndCoach_CoachId(request.getName(), coach.getCoachId())) {
            throw new IllegalArgumentException("You already have a team with this name");
        }
        
        // Update the team
        team.setName(request.getName());
        team.setDescription(request.getDescription());
        
        // Save the updated team
        Team savedTeam = teamRepository.save(team);
        
        // Return the updated team as response
        return mapToResponse(savedTeam);
    }

    @Transactional
    public void deleteTeam(Long teamId, Coach coach) {
        // Find the team
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + teamId));
        
        // Verify the coach owns the team
        if (!team.getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to delete this team");
        }
        
        // Delete the team and its associated evaluations (cascading)
        teamRepository.delete(team);
    }

}