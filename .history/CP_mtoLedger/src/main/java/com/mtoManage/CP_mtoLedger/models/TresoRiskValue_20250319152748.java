package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Treso_Risk_Value", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    private LocalDate dateStart;

    @Column(name = "dDateEnd")
    private LocalDate dateEnd;

    @Column(name = "dDateCreated")
    private LocalDate dateCreated;

    @Column(name = "nAccessId")
    private Integer accessId;

    @Column(name = "sLogin", length = 30)
    private String login;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nProductId", referencedColumnName = "nProductId", insertable = false, updatable = false)
    private TresoProduct product;
} 