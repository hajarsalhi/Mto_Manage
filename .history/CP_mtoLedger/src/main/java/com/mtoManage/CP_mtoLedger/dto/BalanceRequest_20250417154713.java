package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BalanceRequest {
    private Integer id;
    private String productName;
    private BigDecimal balance;
    private BigDecimal prevBalance;
    private String lastTransactionTime;
    private String status;
    
}
