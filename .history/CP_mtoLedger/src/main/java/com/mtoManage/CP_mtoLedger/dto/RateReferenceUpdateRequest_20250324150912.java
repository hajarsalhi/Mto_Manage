package com.mtoManage.CP_mtoLedger.dto;

public interface RateReferenceUpdateRequest {
    
    Integer rate;
    String currency;
    LocalDate dateStart;
    LocalDate dateEnd;
    
}
