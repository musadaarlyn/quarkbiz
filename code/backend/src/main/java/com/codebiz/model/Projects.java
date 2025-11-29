package com.codebiz.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Projects extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "projName", nullable = false)
    public String projName;

    @Column(name = "projDescription")
    public String projDescription;

    // Stored as JSON in MySQL → Scalable + easy
    @Column(name = "techStackIds", columnDefinition = "JSON")
    public String techStackIds;

    @Column(name = "status")
    public String status;

    @Column(name = "startDate")
    public LocalDate startDate;

    @Column(name = "endDate")
    public LocalDate endDate;

    @Column(name = "createdAt")
    public LocalDateTime createdAt;
}
