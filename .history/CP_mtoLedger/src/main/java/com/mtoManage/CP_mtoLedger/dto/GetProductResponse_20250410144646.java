package com.mtoManage.CP_mtoLedger.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetProductResponse {
    private Integer productId;
    private String productName;
    private Integer active;
    private BigDecimal commission;
}
