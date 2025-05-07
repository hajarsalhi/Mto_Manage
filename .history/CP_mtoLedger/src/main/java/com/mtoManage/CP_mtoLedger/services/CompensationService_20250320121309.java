package com.mtoManage.CP_mtoLedger.services;

import com.mtoManage.CP_mtoLedger.dto.CompensationDto;
import com.mtoManage.CP_mtoLedger.models.TresoCompensation;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CompensationService {
    List<TresoCompensation> getAllCompensations();
    Optional<TresoCompensation> getCompensationById(Integer id);
    TresoCompensation uploadCompensation(List<CompensationDto> compensation);
    List<TresoCompensation> getCompensationsByProductId(Integer productId, LocalDate startDate, LocalDate endDate);

} 