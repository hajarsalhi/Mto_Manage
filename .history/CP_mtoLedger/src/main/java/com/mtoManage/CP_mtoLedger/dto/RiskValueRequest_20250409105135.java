package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RiskValueRequest {
    private Integer productId;
    private BigDecimal riskValue;
    
    private LocalDateTime validateFrom;
    
    private LocalDateTime validateTo;
}
