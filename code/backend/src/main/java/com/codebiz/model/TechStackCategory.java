package com.codebiz.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tech_stack_category")
public class TechStackCategory extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "tscName", nullable = false, unique = true)
    public String tscName;

    @Column(name = "tscDescription")
    public String tscDescription;

    @Column(name = "createdAt")
    public LocalDateTime createdAt;
}
