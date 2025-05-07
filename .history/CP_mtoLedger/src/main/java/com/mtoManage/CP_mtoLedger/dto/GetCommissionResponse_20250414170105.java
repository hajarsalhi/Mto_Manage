package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetCommissionResponse {
    private String productName;
    private Integer isActive;
    private BigDecimal tauxCommission;  
    
}
