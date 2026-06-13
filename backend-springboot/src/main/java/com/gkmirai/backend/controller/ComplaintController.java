package com.gkmirai.backend.controller;

import com.gkmirai.backend.model.Complaint;
import com.gkmirai.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByDateRaisedDesc();
    }

    @GetMapping("/flat/{flatNo}")
    public List<Complaint> getComplaintsByFlat(@PathVariable String flatNo) {
        return complaintRepository.findAllByRaisedByFlatOrderByDateRaisedDesc(flatNo);
    }

    @PostMapping
    public Complaint raiseComplaint(@RequestBody Complaint complaint) {
        if (complaint.getId() == null || complaint.getId().isEmpty()) {
            complaint.setId("comp-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (complaint.getDateRaised() == null || complaint.getDateRaised().isEmpty()) {
            complaint.setDateRaised(LocalDate.now().toString());
        }
        if (complaint.getStatus() == null || complaint.getStatus().isEmpty()) {
            complaint.setStatus("Pending");
        }
        return complaintRepository.save(complaint);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable String id, @RequestParam String status) {
        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaint.setStatus(status);
                    return ResponseEntity.ok(complaintRepository.save(complaint));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/remarks")
    public ResponseEntity<Complaint> updateRemarks(@PathVariable String id, @RequestBody String remarks) {
        return complaintRepository.findById(id)
                .map(complaint -> {
                    // Strip enclosing quotes from raw String request body if present
                    String cleanedRemarks = remarks;
                    if (cleanedRemarks.startsWith("\"") && cleanedRemarks.endsWith("\"")) {
                        cleanedRemarks = cleanedRemarks.substring(1, cleanedRemarks.length() - 1);
                    }
                    complaint.setAdminRemarks(cleanedRemarks);
                    return ResponseEntity.ok(complaintRepository.save(complaint));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
