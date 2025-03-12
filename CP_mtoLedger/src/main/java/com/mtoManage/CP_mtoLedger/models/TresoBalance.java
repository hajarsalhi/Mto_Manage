package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Treso_Balance", schema = "dbo", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"dDate", "nProductId"})
})
public class TresoBalance {
    @Column(name = "dDate")
    private LocalDate date;

    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "nRealisationJ_1", precision = 18, scale = 2)
    private BigDecimal realisationJ1;

    @Column(name = "nCompensationJ_1", precision = 18, scale = 2)
    private BigDecimal compensationJ1;

    @Column(name = "nBalance", precision = 20, scale = 7)
    private BigDecimal balance;

    // ... other fields, getters and setters
} 