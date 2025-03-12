package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Treso_Product", schema = "dbo")
public class TresoProduct {
    @Id
    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "sProductName", length = 255)
    private String productName;

    @Column(name = "sProductMethod", length = 255)
    private String productMethod;

    @Column(name = "bActive")
    private Integer active;

    @Column(name = "fFacilite", precision = 18, scale = 2)
    private BigDecimal facilite;

    @Column(name = "fMovingAvg", precision = 18, scale = 2)
    private BigDecimal movingAvg;

    @Column(name = "bDeblock")
    private Boolean deblock = false;

    @Column(name = "fMAwarning", precision = 18, scale = 2)
    private BigDecimal maWarning = new BigDecimal("1.25");

    @Column(name = "fMAblock", precision = 18, scale = 2)
    private BigDecimal maBlock = new BigDecimal("1.5");

    // ... remaining fields

    // Getters and Setters
} 