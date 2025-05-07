package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RiskValueResponse {
    private Integer productId;
    private BigDecimal riskValue;
    private LocalDate validateFrom;
    private LocalDate validateTo;
    
}
