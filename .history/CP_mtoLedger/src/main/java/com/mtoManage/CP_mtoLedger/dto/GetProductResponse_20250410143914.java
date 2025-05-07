package com.mtoManage.CP_mtoLedger.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetProductResponse {
    private Integer productId;
    private String productName;
    private Integer active;
    private BigDecimal commission;
}
