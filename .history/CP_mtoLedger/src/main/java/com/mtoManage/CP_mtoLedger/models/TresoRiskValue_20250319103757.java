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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nProductId", insertable = false, updatable = false)
    private TresoProduct product;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getRiskValue() {
        return riskValue;
    }

    public void setRiskValue(BigDecimal riskValue) {
        this.riskValue = riskValue;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public LocalDateTime getDateStart() {
        return dateStart;
    }

    public void setDateStart(LocalDateTime dateStart) {
        this.dateStart = dateStart;
    }

    public LocalDateTime getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(LocalDateTime dateEnd) {
        this.dateEnd = dateEnd;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Integer getAccessId() {
        return accessId;
    }

    public void setAccessId(Integer accessId) {
        this.accessId = accessId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
    
    public TresoProduct getProduct() {
        return product;
    }

    public void setProduct(TresoProduct product) {
        this.product = product;
    }
} 