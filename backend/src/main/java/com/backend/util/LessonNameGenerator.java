package com.backend.util;

import com.backend.model.Lesson;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class LessonNameGenerator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a");

    /**
     * Generate a name for a lesson based on its properties
     */
    public String generateName(Lesson lesson) {
        StringBuilder nameBuilder = new StringBuilder();
        
        // Check if it's a team lesson
        if (lesson.getTeam() != null) {
            nameBuilder.append(lesson.getTeam().getName()).append(" Practice");
            
            // Add date if scheduled
            if (lesson.getScheduledDate() != null) {
                nameBuilder.append(" | ").append(lesson.getScheduledDate().format(DATE_FORMATTER));
            }
        } else {
            // Non-team lesson
            if (lesson.getWorkshopType() != null && !lesson.getWorkshopType().trim().isEmpty()) {
                nameBuilder.append(lesson.getWorkshopType());
            } else {
                nameBuilder.append("Improv Session");
            }
            
            // Add date if scheduled
            if (lesson.getScheduledDate() != null) {
                nameBuilder.append(" - ").append(lesson.getScheduledDate().format(DATE_FORMATTER));
            }
        }
        
        return nameBuilder.toString();
    }

    /**
     * Generate a detailed name with time information
     */
    public String generateDetailedName(Lesson lesson) {
        StringBuilder nameBuilder = new StringBuilder();
        
        if (lesson.getTeam() != null) {
            nameBuilder.append(lesson.getTeam().getName()).append(" Practice");
        } else {
            if (lesson.getWorkshopType() != null && !lesson.getWorkshopType().trim().isEmpty()) {
                nameBuilder.append(lesson.getWorkshopType());
            } else {
                nameBuilder.append("Improv Session");
            }
        }
        
        // Add date and time if scheduled
        if (lesson.getScheduledDate() != null) {
            nameBuilder.append(" | ")
                      .append(lesson.getScheduledDate().format(DATE_FORMATTER))
                      .append(" at ")
                      .append(lesson.getScheduledDate().format(TIME_FORMATTER));
        }
        
        return nameBuilder.toString();
    }

    /**
     * Generate template name from lesson
     */
    public String generateTemplateName(Lesson lesson) {
        StringBuilder nameBuilder = new StringBuilder();
        
        if (lesson.getWorkshopType() != null && !lesson.getWorkshopType().trim().isEmpty()) {
            nameBuilder.append(lesson.getWorkshopType()).append(" Template");
        } else if (lesson.getTeam() != null) {
            nameBuilder.append(lesson.getTeam().getName()).append(" Practice Template");
        } else {
            nameBuilder.append("Lesson Template");
        }
        
        // Add duration info if available
        if (lesson.getTotalDurationMinutes() != null && lesson.getTotalDurationMinutes() > 0) {
            nameBuilder.append(" (").append(lesson.getTotalDurationMinutes()).append(" min)");
        }
        
        return nameBuilder.toString();
    }

    /**
     * Generate name suggestions based on lesson content
     */
    public List<String> generateNameSuggestions(Lesson lesson) {
        return List.of(
            generateName(lesson),
            generateDetailedName(lesson),
            generateTemplateName(lesson),
            generateWorkshopStyleName(lesson),
            generateFocusBasedName(lesson)
        );
    }

    /**
     * Generate workshop-style name
     */
    private String generateWorkshopStyleName(Lesson lesson) {
        if (lesson.getWorkshopType() != null) {
            return lesson.getWorkshopType() + " Workshop";
        }
        return "Improv Workshop";
    }

    /**
     * Generate name based on primary focus areas (if exercises are loaded)
     */
    private String generateFocusBasedName(Lesson lesson) {
        // This would analyze the exercises and their focus areas
        // For now, return a generic name
        if (lesson.getTeam() != null) {
            return lesson.getTeam().getName() + " Skills Session";
        }
        return "Skills Development Session";
    }
}