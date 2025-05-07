package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Treso_ProductHistory", schema = "dbo")
@Data
public class TresoProductHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "sProductDeviseFx", length = 5)
    private String productDeviseFx;

    @Column(name = "fDecote", precision = 18, scale = 4)
    private BigDecimal decote;

    @Column(name = "sLibDecote", length = 50)
    private String libDecote;

    @Column(name = "dDateNotif")
    private LocalTime dateNotif;

    @Column(name = "sEmail", length = 255)
    private String email;

    @Column(name = "nAccessId", length = 50)
    private String accessId;

    @Column(name = "dDateStart")
    private LocalDateTime dateStart;

    @Column(name = "dDateEnd")
    private LocalDateTime dateEnd;

    @Column(name = "nApplyDay")
    private Short applyDay;

    @Column(name = "tApplyHour")
    private LocalTime applyHour;

    // Getters and Setters
} 