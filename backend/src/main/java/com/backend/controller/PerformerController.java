// PerformerController.java
package com.backend.controller;

import com.backend.dto.PerformerRequest;
import com.backend.dto.PerformerResponse;
import com.backend.service.PerformerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performers")
public class PerformerController {

    private final PerformerService performerService;

    public PerformerController(PerformerService performerService) {
        this.performerService = performerService;
    }

    @GetMapping
    public ResponseEntity<List<PerformerResponse>> getAllPerformers() {
        List<PerformerResponse> performers = performerService.getAllPerformers();
        return ResponseEntity.ok(performers);
    }

    @PostMapping
    public ResponseEntity<PerformerResponse> createPerformer(@RequestBody PerformerRequest request) {
        PerformerResponse response = performerService.createPerformer(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerformerResponse> updatePerformer(
            @PathVariable Long id, 
            @RequestBody PerformerRequest request) {
        PerformerResponse response = performerService.updatePerformer(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerformer(@PathVariable Long id) {
        performerService.deletePerformer(id);
        return ResponseEntity.noContent().build();
    }
}