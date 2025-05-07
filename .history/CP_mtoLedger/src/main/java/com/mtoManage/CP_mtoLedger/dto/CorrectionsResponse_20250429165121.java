package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CorrectionsResponse {
    private Integer id;
    private String date;
    private String mtoName;
    private Integer mtoId;
    private BigDecimal oldBalance;
    private BigDecimal correction;
    private String motif; 
    
}
