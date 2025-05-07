package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "Treso_Current_Balance", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoCurrentBalance {
    @Id
    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "nCurrentBalance", precision = 18, scale = 2)
    private BigDecimal currentBalance;

    @Column(name = "nLastTrxId")
    private Integer lastTrxId;

    @Column(name = "dDateUpdate")
    private LocalDateTime dateUpdate;

    @OneToOne
    @MapsId
    @JoinColumn(name = "nProductId")
    @JsonManagedReference
    private TresoProduct product;

    // Getters and Setters
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public BigDecimal getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(BigDecimal currentBalance) {
        this.currentBalance = currentBalance;
    }

    public Integer getLastTrxId() {
        return lastTrxId;
    }

    public void setLastTrxId(Integer lastTrxId) {
        this.lastTrxId = lastTrxId;
    }

    public LocalDateTime getDateUpdate() {
        return dateUpdate;
    }

    public void setDateUpdate(LocalDateTime dateUpdate) {
        this.dateUpdate = dateUpdate;
    }

    public TresoProduct getProduct() {
        return product;
    }

    public void setProduct(TresoProduct product) {
        this.product = product;
    }
} 