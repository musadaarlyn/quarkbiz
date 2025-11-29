package com.codebiz.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tech_stack")
public class TechStack extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "tsName", nullable = false)
    public String tsName;

    @Column(name = "tsDescription")
    public String tsDescription;

    @ManyToOne
    @JoinColumn(name = "categoryId")
    public TechStackCategory category;

    @Column(name = "createdAt")
    public LocalDateTime createdAt;
}
