package com.mtoManage.CP_mtoLedger.dto;

public class RiskValueRequest {
    private Long productId;
    private BigDecimal riskValue;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime validateFrom;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime validateTo;
}
