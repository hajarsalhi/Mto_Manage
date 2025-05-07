package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "Treso_Commission", schema = "dbo")
static @Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoCommission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Commission_id")
    private Integer id;

    @Column(name = "Product_id")
    private Integer productId;

    @Column(name = "Product_name", length = 50)
    private String productName;

    @Column(name = "Product_type", length = 50)
    private String productType;

    @Column(name = "Product_Sous_Type", length = 50)
    private String productSousType;

    @Column(name = "Type_commission", length = 10)
    private String typeCommission;

    @Column(name = "Taux_commission", precision = 20, scale = 2)
    private BigDecimal tauxCommission;

    @Column(name = "Taux_retrocession", precision = 20, scale = 2)
    private BigDecimal tauxRetrocession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Product_id", referencedColumnName = "nProductId", insertable = false, updatable = false)
    @JsonManagedReference
    private TresoProduct product;
} 