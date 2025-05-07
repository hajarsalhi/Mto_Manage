package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductFinParams {
    private Integer productId;
    private String productName;
    private String devise;
    private BigDecimal tauxCommission;
    private BigDecimal prevTauxCommission;
    private BigDecimal decote;
    private String libDecote;
    private String emails;
    private String reconciliationEmails;
    private Boolean sendReconciliationReports;
    private String productsMethod;
    private LocalTime applyHour;
     
}
