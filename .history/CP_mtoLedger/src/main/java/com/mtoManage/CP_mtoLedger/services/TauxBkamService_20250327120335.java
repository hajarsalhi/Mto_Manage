package com.mtoManage.CP_mtoLedger.services;

import com.mtoManage.CP_mtoLedger.dto.RateReferenceRequest;
import com.mtoManage.CP_mtoLedger.dto.RateReferenceResponse;
import com.mtoManage.CP_mtoLedger.models.TresoBkam;

import java.util.List;

public interface TauxBkamService {
    List<RateReferenceResponse> getLatestRates();
    TresoBkam updateRate(RateReferenceRequest request);
} 