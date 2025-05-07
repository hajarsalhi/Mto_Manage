package com.mtoManage.CP_mtoLedger.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FxRateNotifRequest {

    private Boolean enabled;
    private LocalDateTime lastSent;
    private Integer id;
    private String createdBy;
}
