package com.phas1.service;

import com.phas1.model.FocusArea;
import com.phas1.repository.FocusAreaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FocusAreaService {

    private final FocusAreaRepository focusAreaRepository;

    public FocusAreaService(FocusAreaRepository focusAreaRepository) {
        this.focusAreaRepository = focusAreaRepository;
    }

    // Create
    public FocusArea createFocusArea(FocusArea focusArea) {
        if (focusAreaRepository.existsByNameIgnoreCase(focusArea.getName())) {
            throw new IllegalArgumentException("Focus area with name '" + focusArea.getName() + "' already exists");
        }
        return focusAreaRepository.save(focusArea);
    }

    // Read (single)
    public Optional<FocusArea> getFocusAreaById(Long id) {
        return focusAreaRepository.findById(id);
    }
    
    // Alias for getFocusAreaById (used in controller)
    public Optional<FocusArea> findById(Long id) {
        return getFocusAreaById(id);
    }

    // Read (multiple by IDs)
    public List<FocusArea> findByIds(List<Long> ids) {
        return focusAreaRepository.findAllById(ids);
    }

    // Read (all)
    public List<FocusArea> getAllFocusAreas() {
        return focusAreaRepository.findAll();
    }

    // Update
    public FocusArea updateFocusArea(Long id, FocusArea updatedFocusArea) {
        return focusAreaRepository.findById(id)
                .map(existingFocusArea -> {
                    // Check if name is being changed to an existing name
                    if (!existingFocusArea.getName().equals(updatedFocusArea.getName())) {
                        if (focusAreaRepository.existsByNameIgnoreCase(updatedFocusArea.getName())) {
                            throw new IllegalArgumentException("Focus area with name '" + updatedFocusArea.getName() + "' already exists");
                        }
                    }
                    
                    existingFocusArea.setName(updatedFocusArea.getName());
                    existingFocusArea.setDescription(updatedFocusArea.getDescription());
                    existingFocusArea.setColorCode(updatedFocusArea.getColorCode());
                    return focusAreaRepository.save(existingFocusArea);
                })
                .orElseThrow(() -> new IllegalArgumentException("Focus area not found with id: " + id));
    }

    // Delete
    public void deleteFocusArea(Long id) {
        if (!focusAreaRepository.existsById(id)) {
            throw new IllegalArgumentException("Focus area not found with id: " + id);
        }
        focusAreaRepository.deleteById(id);
    }

    // Check existence
    public boolean focusAreaExists(Long id) {
        return focusAreaRepository.existsById(id);
    }
}