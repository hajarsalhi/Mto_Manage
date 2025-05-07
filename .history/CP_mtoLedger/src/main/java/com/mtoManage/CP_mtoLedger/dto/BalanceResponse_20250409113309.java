package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BalanceResponse {
    private Integer productId;
    private String productName;
    private BigDecimal balance;
    private LocalDateTime dateUpdate;
    private String status;
} 