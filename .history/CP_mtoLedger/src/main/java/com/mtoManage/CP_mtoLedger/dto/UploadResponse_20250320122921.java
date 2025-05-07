package com.mtoManage.CP_mtoLedger.dto;


@Data
@AllArgsConstructor
public class UploadResponse {
    private boolean success;
    private String message;
    private int totalRecords;
    private int validRecords;
    private List<CSVError> errors;
}

@Data
@AllArgsConstructor
public class CSVError {
    private int line;
    private String message;
}