package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "Treso_Product", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "bDeblock")
    private Boolean deblock = false;

    @Column(name = "fMAwarning", precision = 18, scale = 2)
    private BigDecimal maWarning = new BigDecimal("1.25");

    @Column(name = "fMAblock", precision = 18, scale = 2)
    private BigDecimal maBlock = new BigDecimal("1.5");
    
    @Column(name = "nBalanceProductId")
    private Integer balanceProductId;

    @OneToMany(mappedBy = "product")
    private List<TresoTransactions> transactions;

    @OneToMany(mappedBy = "product")
    private List<TresoNotifications> notifications;
    
    @OneToMany(mappedBy = "product")
    private List<TresoBalance> balances;
    
    @OneToMany(mappedBy = "product")
    private List<TresoCompensation> compensations;
    
    @OneToMany(mappedBy = "product")
    private List<TresoCommission> commissions;
    
    @OneToOne
    @JoinColumn(name = "nProductId", referencedColumnName = "nId")
    private Product product;
    
    @OneToOne(mappedBy = "product")
    private TresoCurrentBalance currentBalance;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nBalanceProductId", referencedColumnName = "nProductId", insertable = false, updatable = false)
    private TresoProduct balanceProduct;
    
    @OneToMany(mappedBy = "balanceProduct")
    private List<TresoProduct> relatedProducts;
    
    @OneToMany(mappedBy = "product")
    private List<TresoRiskValue> riskValues;

    // Getters and Setters
} 