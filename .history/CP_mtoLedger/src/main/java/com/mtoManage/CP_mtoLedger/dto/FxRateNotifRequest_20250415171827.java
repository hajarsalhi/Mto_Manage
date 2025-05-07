package com.mtoManage.CP_mtoLedger.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class FxRateNotifRequest {

    private Boolean enabled;
    private LocalDate lastSent;
    private String createdBy;
    
}
