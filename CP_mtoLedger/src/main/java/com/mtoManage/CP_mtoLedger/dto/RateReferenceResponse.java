package com.mtoManage.CP_mtoLedger.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RateReferenceResponse {
    private Integer id;
    private String currency;
    private Double rate;
    private String date;
} 