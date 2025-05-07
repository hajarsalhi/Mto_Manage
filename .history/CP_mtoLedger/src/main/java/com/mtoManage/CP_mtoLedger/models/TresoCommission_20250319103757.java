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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Product_id", referencedColumnName = "nProductId", insertable = false, updatable = false)
    private TresoProduct product;

    // Getters and Setters
    public Integer getCommissionId() {
        return commissionId;
    }

    public void setCommissionId(Integer commissionId) {
        this.commissionId = commissionId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getProductSousType() {
        return productSousType;
    }

    public void setProductSousType(String productSousType) {
        this.productSousType = productSousType;
    }

    public String getTypeCommission() {
        return typeCommission;
    }

    public void setTypeCommission(String typeCommission) {
        this.typeCommission = typeCommission;
    }

    public BigDecimal getTauxCommission() {
        return tauxCommission;
    }

    public void setTauxCommission(BigDecimal tauxCommission) {
        this.tauxCommission = tauxCommission;
    }

    public BigDecimal getTauxRetrocession() {
        return tauxRetrocession;
    }

    public void setTauxRetrocession(BigDecimal tauxRetrocession) {
        this.tauxRetrocession = tauxRetrocession;
    }
    
    public TresoProduct getProduct() {
        return product;
    }

    public void setProduct(TresoProduct product) {
        this.product = product;
    }
} 