package com.gkmirai.backend.repository;

import com.gkmirai.backend.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, String> {
    List<Complaint> findAllByRaisedByFlatOrderByDateRaisedDesc(String raisedByFlat);
    List<Complaint> findAllByOrderByDateRaisedDesc();
}
