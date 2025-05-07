package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "Product", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;
    
    @Column(name = "sName", length = 50)
    private String name;
    
    @Column(name = "bActive")
    private Boolean active = true;
    
    @Column(name = "nProductTypeId")
    private Integer productTypeId;
    
    @Column(name = "bBilled")
    private Boolean billed;
    
    @Column(name = "nOperatorId")
    private Integer operatorId;
    
    @Column(name = "nProductMappingId")
    private Integer productMappingId;
    
    @Column(name = "nVAT", precision = 10, scale = 2)
    private BigDecimal vat;
    
    @Column(name = "bCorrespondence")
    private Boolean correspondence;
    
    @Column(name = "sLogo", length = 50)
    private String logo;
    
    @Column(name = "sProcess", length = 50)
    private String process;
    
    @Column(name = "bShow")
    private Boolean show;
    
    @Column(name = "nFlatPrice", precision = 8, scale = 2)
    private BigDecimal flatPrice;
    
    @Column(name = "bSpecialPrice")
    private Boolean specialPrice = false;
    
    @Column(name = "sSpecialPriceCondition", length = 50)
    private String specialPriceCondition;
    
    @Column(name = "nPrintTemplateId")
    private Integer printTemplateId;
    
    @Column(name = "nPrintTemplateMappingId")
    private Integer printTemplateMappingId;
    
    @OneToOne(mappedBy = "product")
    private TresoProduct tresoProduct;
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Boolean getShow() {
        return show;
    }

    public void setShow(Boolean show) {
        this.show = show;
    }
    
    public TresoProduct getTresoProduct() {
        return tresoProduct;
    }

    public void setTresoProduct(TresoProduct tresoProduct) {
        this.tresoProduct = tresoProduct;
    }
} 