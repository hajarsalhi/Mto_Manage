package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetCommissionResponse {
    private String productName;
    private Boolean isActive;
    private BigDecimal tauxCommission;  
    
}
