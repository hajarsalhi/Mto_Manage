package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Treso_Notifications", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoNotifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "dDate")
    private LocalDateTime date;

    @Column(name = "nRate", precision = 18, scale = 4)
    private BigDecimal rate;

    @Column(name = "sType", length = 50)
    private String type;

    @Column(name = "sMethod", length = 10)
    private String method;

    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "bReceived")
    private Integer received;

    @Column(name = "updatedBy", length = 20)
    private String updatedBy;

    @Column(name = "fDecote", precision = 18, scale = 2)
    private BigDecimal decote;

    @Column(name = "sLibDecote", length = 50)
    private String libDecote;

    @Column(name = "dDateNotif")
    private LocalTime dateNotif;

    @Column(name = "sProductDeviseFx", length = 50)
    private String productDeviseFx;

    @Column(name = "sSource", length = 20)
    private String source;

    @Column(name = "dApplyDate")
    private LocalDateTime applyDate;

    @Column(name = "dNextApplyDate")
    private LocalDateTime nextApplyDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nProductId", referencedColumnName = "nProductId", insertable = false, updatable = false)
    private TresoProduct product;

    // Getters and Setters
} 