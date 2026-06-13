package com.gkmirai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000, nullable = false)
    private String description;

    @Column(nullable = false)
    private String category; // "General" | "Maintenance" | "Event" | "Security" | "Meeting"

    @Column(nullable = false)
    private String date; // YYYY-MM-DD format

    @Column(nullable = false)
    private String author;

    private boolean urgent;
}
