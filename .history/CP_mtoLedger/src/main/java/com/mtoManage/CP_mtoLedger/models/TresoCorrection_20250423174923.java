package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Correction", schema = "dbo")
@Data
public class TresoCorrection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "dDate")
    private LocalDateTime date;

    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "nOldBalance", precision = 16, scale = 2)
    private BigDecimal oldBalance;

    @Column(name = "nCorrection", precision = 16, scale = 2)
    private BigDecimal correction;

    @Column(name = "sMotif", length = 255)
    private String motif;

    @Column(name = "nCorrectedBy")
    private Integer correctedBy;

    // Getters and Setters
} 