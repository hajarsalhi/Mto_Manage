package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Treso_Balance", schema = "dbo")
public class TresoBalance {

    @EmbeddedId
    private TresoBalanceId id;

    @Column(name = "nRealisationJ_1", precision = 18, scale = 2)
    private BigDecimal realisationJ1;

    @Column(name = "nCompensationJ_1", precision = 18, scale = 2)
    private BigDecimal compensationJ1;
    
    @Column(name = "nCommissionJ_1", precision = 18, scale = 2)
    private BigDecimal commissionJ1;
    
    @Column(name = "nCompTheorique", precision = 18, scale = 2)
    private BigDecimal compTheorique;

    @Column(name = "nBalance", precision = 20, scale = 7)
    private BigDecimal balance;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nProductId", insertable = false, updatable = false)
    private TresoProduct product;

    // Constructor
    public TresoBalance() {
    }

    // Getters and setters
    public TresoBalanceId getId() {
        return id;
    }

    public void setId(TresoBalanceId id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return id != null ? id.getDate() : null;
    }

    public void setDate(LocalDate date) {
        if (id == null) {
            id = new TresoBalanceId();
        }
        id.setDate(date);
    }

    public Integer getProductId() {
        return id != null ? id.getProductId() : null;
    }

    public void setProductId(Integer productId) {
        if (id == null) {
            id = new TresoBalanceId();
        }
        id.setProductId(productId);
    }

    public BigDecimal getRealisationJ1() {
        return realisationJ1;
    }

    public void setRealisationJ1(BigDecimal realisationJ1) {
        this.realisationJ1 = realisationJ1;
    }

    public BigDecimal getCompensationJ1() {
        return compensationJ1;
    }

    public void setCompensationJ1(BigDecimal compensationJ1) {
        this.compensationJ1 = compensationJ1;
    }
    
    public BigDecimal getCommissionJ1() {
        return commissionJ1;
    }

    public void setCommissionJ1(BigDecimal commissionJ1) {
        this.commissionJ1 = commissionJ1;
    }
    
    public BigDecimal getCompTheorique() {
        return compTheorique;
    }

    public void setCompTheorique(BigDecimal compTheorique) {
        this.compTheorique = compTheorique;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
    
    public TresoProduct getProduct() {
        return product;
    }

    public void setProduct(TresoProduct product) {
        this.product = product;
    }
} 