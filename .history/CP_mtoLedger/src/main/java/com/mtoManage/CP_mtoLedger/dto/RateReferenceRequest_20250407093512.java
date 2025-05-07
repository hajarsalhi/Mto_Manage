package com.mtoManage.CP_mtoLedger.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RateReferenceRequest {
    private String devise;
    private Double coursVirement;
    private String source;
} 