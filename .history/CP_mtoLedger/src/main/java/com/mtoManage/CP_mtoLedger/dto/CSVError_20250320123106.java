package com.mtoManage.CP_mtoLedger.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CSVError {
    private int line;
    private String message;
}