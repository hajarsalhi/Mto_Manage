package com.mtoManage.CP_mtoLedger.dto;


import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.time.LocalDate;

import lombok.Data;

@Data
public class CompensationDto {
    private String reference;

    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate dateEnvoi;

    private Long idMTO;
    private String nomMTO;
    private Double amount;
    private Double fxRate;
    private String currency;
}
