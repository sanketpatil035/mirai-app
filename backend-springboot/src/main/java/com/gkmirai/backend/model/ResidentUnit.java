package com.gkmirai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "resident_units")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResidentUnit {

    @Id
    private String id;

    @Column(name = "flat_no", nullable = false)
    private String flatNo;

    @Column(nullable = false)
    private String block; // "A" | "B" | "C" | "D"

    @Column(name = "owner_name", nullable = false)
    private String ownerName;

    @Column(name = "owner_email", nullable = false)
    private String ownerEmail;

    @Column(nullable = false)
    private String status; // "Owner" | "Tenant"

    @Column(name = "dues_status", nullable = false)
    private String duesStatus; // "Paid" | "Unpaid"

    @Column(name = "dues_amount", nullable = false)
    private double duesAmount;

    @Column(name = "last_payment_date")
    private String lastPaymentDate; // YYYY-MM-DD

    @Column(name = "password", nullable = false)
    private String password;
}
