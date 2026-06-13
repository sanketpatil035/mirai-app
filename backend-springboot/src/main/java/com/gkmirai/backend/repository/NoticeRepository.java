package com.gkmirai.backend.repository;

import com.gkmirai.backend.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, String> {
    List<Notice> findAllByOrderByUrgentDescDateDesc();
}
