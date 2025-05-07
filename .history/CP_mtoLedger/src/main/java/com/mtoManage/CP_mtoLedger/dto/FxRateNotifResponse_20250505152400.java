package com.mtoManage.CP_mtoLedger.dto;

import java.time.LocalDateTime;

import lombok.Data;
@Data
public class FxRateNotifResponse {
    private LocalDateTime date;
    private String Type;
    private String subject;
    private String[] recipients;
    private Integer status;
   
}
