package com.mtoManage.CP_mtoLedger.services;

import com.mtoManage.CP_mtoLedger.dto.UploadResponse;
import com.mtoManage.CP_mtoLedger.models.TresoCompenTemp;
import com.mtoManage.CP_mtoLedger.models.TresoCompensation;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;


public interface CompensationService {
    List<TresoCompensation> getAllCompensations();
    Optional<TresoCompensation> getCompensationById(Integer id);
    UploadResponse processCSVFile(MultipartFile file) throws IOException;
    List<TresoCompensation> getCompensationsByProductId(Integer productId, LocalDate startDate, LocalDate endDate);

    List<TresoCompenTemp> getAllTempCompen();
    
    void validateCompensations(List<Integer> ids);
} 