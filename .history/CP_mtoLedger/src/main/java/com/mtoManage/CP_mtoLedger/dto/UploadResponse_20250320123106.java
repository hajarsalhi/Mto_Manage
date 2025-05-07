package com.mtoManage.CP_mtoLedger.dto;

import lombok.Data;

@Data
@
public class UploadResponse {
    private boolean success;
    private String message;
    private int totalRecords;
    private int validRecords;
    private List<CSVError> errors;
}
