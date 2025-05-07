

package com.mtoManage.CP_mtoLedger.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data 
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransORCompResponse {

    private LocalDate date;
    private Integer number;
    private BigDecimal amount;
    private String reference ;
    private String status;

}