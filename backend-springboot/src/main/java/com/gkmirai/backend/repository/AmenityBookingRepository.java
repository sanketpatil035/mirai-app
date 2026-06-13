package com.gkmirai.backend.repository;

import com.gkmirai.backend.model.AmenityBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityBookingRepository extends JpaRepository<AmenityBooking, String> {
    List<AmenityBooking> findAllByBookedByFlatOrderByBookedAtDesc(String bookedByFlat);
    List<AmenityBooking> findAllByOrderByBookedAtDesc();
}
