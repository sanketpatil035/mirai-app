package com.gkmirai.backend.repository;

import com.gkmirai.backend.model.ResidentUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResidentUnitRepository extends JpaRepository<ResidentUnit, String> {
    Optional<ResidentUnit> findByFlatNoIgnoreCase(String flatNo);
}
