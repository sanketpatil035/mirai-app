package com.gkmirai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000, nullable = false)
    private String description;

    @Column(nullable = false)
    private String category; // "Plumbing" | "Electrical" | "Housekeeping" | "Security" | "Parking" | "Other"

    @Column(nullable = false)
    private String status; // "Pending" | "In Progress" | "Resolved"

    @Column(name = "raised_by", nullable = false)
    private String raisedBy;

    @Column(name = "raised_by_flat", nullable = false)
    private String raisedByFlat;

    @Column(name = "date_raised", nullable = false)
    private String dateRaised; // YYYY-MM-DD

    @Column(nullable = false)
    private String urgency; // "Low" | "Medium" | "High"

    @Column(name = "admin_remarks", length = 1000)
    private String adminRemarks;
}
