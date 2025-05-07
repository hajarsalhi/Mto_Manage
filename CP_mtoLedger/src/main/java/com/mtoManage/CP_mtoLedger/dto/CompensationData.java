package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompensationData {
    private Integer id;
    private LocalDate date;
    private String mtoName;
    private BigDecimal compensation;
    private BigDecimal fxRate;
    private String currency;
}
