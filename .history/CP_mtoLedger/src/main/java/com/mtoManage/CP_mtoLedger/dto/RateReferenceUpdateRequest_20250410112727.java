package com.mtoManage.CP_mtoLedger.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class RateReferenceUpdateRequest {
    
    private Integer rate;
    private String currency;
    private String source;
    
}
