package com.mtoManage.CP_mtoLedger.services.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.mtoManage.CP_mtoLedger.dto.RiskValueRequest;
import com.mtoManage.CP_mtoLedger.models.TresoRiskValue;
import com.mtoManage.CP_mtoLedger.repositories.TresoRiskValueRepository;

public class RiskValueServiceImpl {

    @Autowired
    public TresoRiskValueRepository tresoRiskValueRepository;

    public Object createRiskValue(RiskValueRequest request) {
        
        TresoRiskValue tresoRiskValue = new TresoRiskValue();
        tresoRiskValue.setProductId(request.getProductId());
        tresoRiskValue.setRiskValue(request.getRiskValue());
        tresoRiskValue.setDateStart(request.getValidateFrom());
        tresoRiskValue.setDateEnd(request.getValidateTo());

        return tresoRiskValueRepository.save(tresoRiskValue);
    }
    
}
