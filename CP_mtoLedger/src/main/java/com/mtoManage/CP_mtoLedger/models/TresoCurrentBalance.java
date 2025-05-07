package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

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

    @Version
    @Column(name = "version")
    private Long version;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nProductId", referencedColumnName = "nProductId", insertable = false, updatable = false)
    @JsonBackReference
    private TresoProduct product;


}