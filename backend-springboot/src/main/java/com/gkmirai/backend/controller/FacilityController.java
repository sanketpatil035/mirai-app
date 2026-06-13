package com.gkmirai.backend.controller;

import com.gkmirai.backend.model.Facility;
import com.gkmirai.backend.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/facilities")
public class FacilityController {

    @Autowired
    private FacilityRepository facilityRepository;

    @GetMapping
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable String id) {
        return facilityRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
