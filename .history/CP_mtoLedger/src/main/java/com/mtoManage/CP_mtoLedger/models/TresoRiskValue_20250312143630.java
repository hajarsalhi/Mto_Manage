package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Risk_Value", schema = "dbo")
public class TresoRiskValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "fRiskValue", precision = 18, scale = 0)
    private BigDecimal riskValue;

    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "dDateStart")
    private LocalDateTime dateStart;

    @Column(name = "dDateEnd")
    private LocalDateTime dateEnd;

    @Column(name = "dDateCreated")
    private LocalDateTime dateCreated;

    @Column(name = "nAccessId")
    private Integer accessId;

    @Column(name = "sLogin", length = 30)
    private String login;

    // Getters and Setters
} 