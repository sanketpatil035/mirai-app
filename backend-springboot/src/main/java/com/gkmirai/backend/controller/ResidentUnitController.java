package com.gkmirai.backend.controller;

import com.gkmirai.backend.model.ResidentUnit;
import com.gkmirai.backend.repository.ResidentUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/residents")
public class ResidentUnitController {

    @Autowired
    private ResidentUnitRepository residentUnitRepository;

    @GetMapping
    public List<ResidentUnit> getAllResidents() {
        return residentUnitRepository.findAll();
    }

    @GetMapping("/flat/{flatNo}")
    public ResponseEntity<ResidentUnit> getResidentByFlat(@PathVariable String flatNo) {
        return residentUnitRepository.findByFlatNoIgnoreCase(flatNo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResidentUnit enrollResidentUnit(@RequestBody ResidentUnit unit) {
        if (unit.getId() == null || unit.getId().isEmpty()) {
            unit.setId("u-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (unit.getDuesStatus() == null || unit.getDuesStatus().isEmpty()) {
            unit.setDuesStatus("Unpaid");
        }
        if (unit.getPassword() == null || unit.getPassword().isEmpty()) {
            unit.setPassword("password");
        }
        return residentUnitRepository.save(unit);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginResident(@RequestBody LoginRequest loginReq) {
        if (loginReq.getFlatNo() == null || loginReq.getPassword() == null) {
            return ResponseEntity.badRequest().body("Flat number and Password are required");
        }
        return residentUnitRepository.findByFlatNoIgnoreCase(loginReq.getFlatNo().trim())
                .map(unit -> {
                    if (loginReq.getPassword().equals(unit.getPassword())) {
                        return ResponseEntity.ok(unit);
                    } else {
                        return ResponseEntity.status(401).body("Incorrect security passcode.");
                    }
                })
                .orElse(ResponseEntity.status(404).body("We couldn't find a resident unit with Flat " + loginReq.getFlatNo()));
    }

    public static class LoginRequest {
        private String flatNo;
        private String password;

        public String getFlatNo() { return flatNo; }
        public void setFlatNo(String flatNo) { this.flatNo = flatNo; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PatchMapping("/{id}/toggle-dues")
    public ResponseEntity<ResidentUnit> toggleDues(@PathVariable String id) {
        return residentUnitRepository.findById(id)
                .map(unit -> {
                    if ("Paid".equalsIgnoreCase(unit.getDuesStatus())) {
                        unit.setDuesStatus("Unpaid");
                        unit.setLastPaymentDate(null);
                    } else {
                        unit.setDuesStatus("Paid");
                        unit.setLastPaymentDate(LocalDate.now().toString());
                    }
                    return ResponseEntity.ok(residentUnitRepository.save(unit));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<ResidentUnit> payDues(@PathVariable String id) {
        return residentUnitRepository.findById(id)
                .map(unit -> {
                    unit.setDuesStatus("Paid");
                    unit.setLastPaymentDate(LocalDate.now().toString());
                    return ResponseEntity.ok(residentUnitRepository.save(unit));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
