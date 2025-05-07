package com.mtoManage.CP_mtoLedger.dto;

import java.time.LocalDate;

import lombok.Data;
@Data
public class FxRateNotifResponse {
    private LocalDate date;
    private String Type;
    private String subject;
    private String[] recipients;
    private Integer status;
   
}
