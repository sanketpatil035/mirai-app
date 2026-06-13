package com.gkmirai.backend.controller;

import com.gkmirai.backend.model.Notice;
import com.gkmirai.backend.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notices")
public class NoticeController {

    @Autowired
    private NoticeRepository noticeRepository;

    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByUrgentDescDateDesc();
    }

    @PostMapping
    public Notice createNotice(@RequestBody Notice notice) {
        if (notice.getId() == null || notice.getId().isEmpty()) {
            notice.setId("not-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (notice.getDate() == null || notice.getDate().isEmpty()) {
            notice.setDate(LocalDate.now().toString());
        }
        return noticeRepository.save(notice);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable String id) {
        if (noticeRepository.existsById(id)) {
            noticeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
