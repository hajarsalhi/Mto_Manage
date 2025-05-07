package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Balance", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "dDateUpdate")
    private LocalDateTime dateUpdate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nProductId", referencedColumnName = "nProductId", insertable = false, updatable = false)
    private TresoProduct product;
} 