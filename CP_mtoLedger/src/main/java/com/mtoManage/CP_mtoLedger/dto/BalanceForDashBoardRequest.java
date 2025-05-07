

package com.mtoManage.CP_mtoLedger.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BalanceForDashBoardRequest {
    private Integer productId;
    private String productName;
    private BigDecimal realTimeBalance;
    private BigDecimal balanceJ_1;
    private LocalDateTime dateUpdate;
    private String status;
    private BigDecimal riskValue;
}