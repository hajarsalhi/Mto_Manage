package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Activation_Notif", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoActivationNotif {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "dDateJ")
    private LocalDate date;

    @Column(name = "bState")
    private Boolean state;

    @Column(name = "dDateActivation")
    private LocalDateTime dateActivation;

    @Column(name = "sCreatedBy", length = 50)
    private String createdBy;

    // Getters and Setters
} 