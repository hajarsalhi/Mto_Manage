package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Embeddable
public class TresoBalanceId implements Serializable {
    private LocalDate date;
    private Integer productId;

    public TresoBalanceId() {
    }

    public TresoBalanceId(LocalDate date, Integer productId) {
        this.date = date;
        this.productId = productId;
    }

    // Getters and setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TresoBalanceId that = (TresoBalanceId) o;
        return Objects.equals(date, that.date) &&
                Objects.equals(productId, that.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(date, productId);
    }
}