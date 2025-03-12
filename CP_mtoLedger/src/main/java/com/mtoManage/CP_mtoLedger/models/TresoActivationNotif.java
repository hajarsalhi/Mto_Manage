package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Activation_Notif", schema = "dbo")
public class TresoActivationNotif {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "dDateJ")
    private LocalDate dateJ;

    @Column(name = "bState")
    private Boolean state;

    @Column(name = "dDateActivation")
    private LocalDateTime dateActivation;

    @Column(name = "sCreatedBy", length = 50)
    private String createdBy;

    // Getters and Setters
} 