package com.mtoManage.CP_mtoLedger.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UploadResponse {
    private boolean success;
    private String message;
    private int totalRecords;
    private int validRecords;
    private List<CSVError> errors;
}
