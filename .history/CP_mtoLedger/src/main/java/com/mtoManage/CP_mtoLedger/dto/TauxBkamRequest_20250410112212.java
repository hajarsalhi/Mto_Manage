package com.mtoManage.CP_mtoLedger.dto;

import lombok.Data;

@Data
public class TauxBkamRequest {
    private float rate;
    private String currency;
    private String source;
}
