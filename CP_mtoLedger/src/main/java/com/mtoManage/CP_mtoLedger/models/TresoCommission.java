package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Treso_Commission", schema = "dbo")
public class TresoCommission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Commission_id")
    private Integer commissionId;

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

    // Getters and Setters
} 