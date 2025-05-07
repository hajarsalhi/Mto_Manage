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

    @Column(name = "nBalance", precision = 20, scale = 7)
    private BigDecimal balance;

    // ... other fields, getters and setters
} 