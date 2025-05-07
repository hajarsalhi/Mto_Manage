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
@Table(name = "Treso_Transactions", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoTransactions {
    @Id
    @Column(name = "nTransactionId")
    private Integer id;

    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "sProductName", length = 255)
    private String productName;

    @Column(name = "nAmountDH", precision = 18, scale = 2)
    private BigDecimal amountDH;

    @Column(name = "sTransactionCode", length = 255)
    private String transactionCode;

    @Column(name = "nTauxTheorique", precision = 18, scale = 2)
    private BigDecimal tauxTheorique;

    @Column(name = "nAmountDevise", precision = 18, scale = 2)
    private BigDecimal amountDevise;

    @Column(name = "sDevise", length = 255)
    private String devise;

    @Column(name = "fTauxReel1", precision = 18, scale = 2)
    private BigDecimal tauxReel1;

    @Column(name = "dDate")
    private LocalDateTime date;

    @Column(name = "fTauxReel2", precision = 18, scale = 2)
    private BigDecimal tauxReel2;

    @Column(name = "nCompensationId1")
    private Integer compensationId1;

    @Column(name = "nCompAmount1", precision = 18, scale = 2)
    private BigDecimal compAmount1;

    @Column(name = "nCompensationId2", precision = 18, scale = 2)
    private BigDecimal compensationId2;

    @Column(name = "nCompAmount2", precision = 18, scale = 2)
    private BigDecimal compAmount2;

    @Column(name = "bCorrection")
    private Boolean correction = false;

    @Column(name = "sTransactionInternalCode", length = 30)
    private String transactionInternalCode;

    @Column(name = "sSendCurrency", length = 20)
    private String sendCurrency;

    @Column(name = "nCommission", precision = 10, scale = 8)
    private BigDecimal commission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nProductId", referencedColumnName = "nProductId", insertable = false, updatable = false)
    @JsonManagedReference
    private TresoProduct product;
} 