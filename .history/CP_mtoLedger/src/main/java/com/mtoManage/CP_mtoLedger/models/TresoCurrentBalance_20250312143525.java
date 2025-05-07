package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Current_Balance", schema = "dbo")
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

    // Getters and Setters
} 