package com.mtoManage.CP_mtoLedger.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RateReferenceUpdateRequest {
    
    private Integer rate;
    private String currency;
    private LocalDate dateStart;
    private LocalDate dateEnd;
    
}
