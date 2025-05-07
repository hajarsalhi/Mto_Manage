package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionData {
    private Integer id;
    private LocalDate date;
    private String mtoName;
    private BigDecimal transaction;
    private BigDecimal fxRate;
    private String currency;


    
}
