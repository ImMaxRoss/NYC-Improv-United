package com.phas1.service;


import com.phas1.dto.EvaluationRequest;
import com.phas1.dto.EvaluationResponse;
import com.phas1.dto.EvaluationUpdateRequest;
import com.phas1.model.Coach;
import com.phas1.model.Evaluation;
import com.phas1.model.Team;
import com.phas1.repository.EvaluationRepository;
import com.phas1.repository.TeamRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationService {
    private final EvaluationRepository evaluationRepository;
    private final TeamRepository teamRepository;

    @Transactional
    public EvaluationResponse createEvaluation(EvaluationRequest request, Coach coach) {
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        
        // Verify that the coach owns the team
        if (!team.getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to evaluate this team");
        }
        
        Evaluation evaluation = new Evaluation();
        evaluation.setTeam(team);
        evaluation.setPerformanceDate(request.getPerformanceDate());
        evaluation.setPerformerNames(request.getPerformerNames());
        evaluation.setYesAnd(request.getYesAnd());
        evaluation.setAgreement(request.getAgreement());
        evaluation.setWhoWhatWhere(request.getWhoWhatWhere());
        evaluation.setPhysicality(request.getPhysicality());
        evaluation.setListening(request.getListening());
        evaluation.setCommitment(request.getCommitment());
        evaluation.setAvoidanceOfDenial(request.getAvoidanceOfDenial());
        evaluation.setEfficiency(request.getEfficiency());
        evaluation.setNotes(request.getNotes());
        
        Evaluation savedEvaluation = evaluationRepository.save(evaluation);
        return mapToResponse(savedEvaluation);
    }
    
    @Transactional(readOnly = true)
    public List<EvaluationResponse> getEvaluationsByTeam(Long teamId, Coach coach) {
        // Verify that the coach owns the team
        if (!teamRepository.isTeamOwnedByCoach(teamId, coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to view evaluations for this team");
        }
        
        return evaluationRepository.findByTeam_TeamId(teamId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EvaluationResponse> getAllEvaluationsByCoach(Coach coach) {
        // Get all team IDs owned by the coach
        List<Long> teamIds = teamRepository.findByCoach_CoachId(coach.getCoachId()).stream()
                .map(Team::getTeamId)
                .collect(Collectors.toList());
        
        // Get all evaluations for these teams
        return evaluationRepository.findByTeam_TeamIdIn(teamIds).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public EvaluationResponse getEvaluationById(Long evaluationId, Coach coach) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new IllegalArgumentException("Evaluation not found"));
        
        // Verify the coach owns the team associated with this evaluation
        if (!evaluation.getTeam().getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to view this evaluation");
        }
        
        return mapToResponse(evaluation);
    }
    
    private EvaluationResponse mapToResponse(Evaluation evaluation) {
        return EvaluationResponse.builder()
                .id(evaluation.getId())
                .teamId(evaluation.getTeam().getTeamId())
                .performanceDate(evaluation.getPerformanceDate())
                .teamName(evaluation.getTeam().getName())
                .performerNames(evaluation.getPerformerNames())
                .yesAnd(evaluation.getYesAnd())
                .agreement(evaluation.getAgreement())
                .whoWhatWhere(evaluation.getWhoWhatWhere())
                .physicality(evaluation.getPhysicality())
                .listening(evaluation.getListening())
                .commitment(evaluation.getCommitment())
                .avoidanceOfDenial(evaluation.getAvoidanceOfDenial())
                .efficiency(evaluation.getEfficiency())
                .notes(evaluation.getNotes())
                .build();
    }

    @Transactional
    public EvaluationResponse updateEvaluation(Long evaluationId, EvaluationUpdateRequest request, Coach coach) {
        // Find the evaluation
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new IllegalArgumentException("Evaluation not found with id: " + evaluationId));
        
        // Verify the coach owns the team associated with this evaluation
        if (!evaluation.getTeam().getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to update this evaluation");
        }
        
        // Update only the fields that are provided in the request
        if (request.getPerformerNames() != null) {
            evaluation.setPerformerNames(request.getPerformerNames());
        }
        
        if (request.getYesAnd() != null) {
            evaluation.setYesAnd(request.getYesAnd());
        }
        
        if (request.getAgreement() != null) {
            evaluation.setAgreement(request.getAgreement());
        }
        
        if (request.getWhoWhatWhere() != null) {
            evaluation.setWhoWhatWhere(request.getWhoWhatWhere());
        }
        
        if (request.getPhysicality() != null) {
            evaluation.setPhysicality(request.getPhysicality());
        }
        
        if (request.getListening() != null) {
            evaluation.setListening(request.getListening());
        }
        
        if (request.getCommitment() != null) {
            evaluation.setCommitment(request.getCommitment());
        }
        
        if (request.getAvoidanceOfDenial() != null) {
            evaluation.setAvoidanceOfDenial(request.getAvoidanceOfDenial());
        }
        
        if (request.getEfficiency() != null) {
            evaluation.setEfficiency(request.getEfficiency());
        }
        
        if (request.getNotes() != null) {
            evaluation.setNotes(request.getNotes());
        }
        
        // Save the updated evaluation
        Evaluation savedEvaluation = evaluationRepository.save(evaluation);
        
        // Return the updated evaluation as response
        return mapToResponse(savedEvaluation);
    }

    @Transactional
    public void deleteEvaluation(Long evaluationId, Coach coach) {
        // Find the evaluation
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new IllegalArgumentException("Evaluation not found with id: " + evaluationId));
        
        // Verify the coach owns the team associated with this evaluation
        if (!evaluation.getTeam().getCoach().getCoachId().equals(coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to delete this evaluation");
        }
        
        // Delete the evaluation
        evaluationRepository.delete(evaluation);
    }


    @Transactional(readOnly = true)
    public List<EvaluationResponse> getEvaluationsByTeamAndDateRange(
            Long teamId, LocalDateTime startDate, LocalDateTime endDate, Coach coach) {
        
        // Verify that the coach owns the team
        if (!teamRepository.isTeamOwnedByCoach(teamId, coach.getCoachId())) {
            throw new IllegalArgumentException("Not authorized to view evaluations for this team");
        }
        
        List<Evaluation> evaluations;
        
        // Apply date filters if provided
        if (startDate != null && endDate != null) {
            evaluations = evaluationRepository.findByTeam_TeamIdAndPerformanceDateBetween(
                    teamId, startDate, endDate);
        } else if (startDate != null) {
            evaluations = evaluationRepository.findByTeam_TeamIdAndPerformanceDateAfter(
                    teamId, startDate);
        } else if (endDate != null) {
            evaluations = evaluationRepository.findByTeam_TeamIdAndPerformanceDateBefore(
                    teamId, endDate);
        } else {
            evaluations = evaluationRepository.findByTeam_TeamId(teamId);
        }
        
        return evaluations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }




}