package com.gkmirai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "amenity_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmenityBooking {

    @Id
    private String id;

    @Column(name = "amenity_id", nullable = false)
    private String amenityId;

    @Column(name = "amenity_name", nullable = false)
    private String amenityName;

    @Column(name = "booked_by", nullable = false)
    private String bookedBy;

    @Column(name = "booked_by_flat", nullable = false)
    private String bookedByFlat;

    @Column(nullable = false)
    private String date; // YYYY-MM-DD

    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    @Column(nullable = false)
    private String status; // "Approved" | "Pending" | "Rejected"

    @Column(name = "guests_count", nullable = false)
    private int guestsCount;

    @Column(name = "booked_at", nullable = false)
    private String bookedAt; // YYYY-MM-DD HH:MM AM/PM
}
