package com.mtoManage.CP_mtoLedger.services.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.dto.RiskValueRequest;
import com.mtoManage.CP_mtoLedger.models.TresoRiskValue;
import com.mtoManage.CP_mtoLedger.repositories.TresoRiskValueRepository;

@Service
public class RiskValueServiceImpl {

    @Autowired
    public TresoRiskValueRepository tresoRiskValueRepository;

    public void createRiskValue(RiskValueRequest request) {

        System.out.println("Creating risk value: " + request);
        
        TresoRiskValue tresoRiskValue = new TresoRiskValue();
        tresoRiskValue.setProductId(request.getProductId());
        tresoRiskValue.setRiskValue(request.getRiskValue());
        tresoRiskValue.setDateStart(request.getValidateFrom());
        tresoRiskValue.setDateEnd(request.getValidateTo());
        tresoRiskValue.setDateCreated(LocalDate.now());

        tresoRiskValueRepository.save(tresoRiskValue);
    }

    public List<TresoRiskValue> getRiskValues() {
        return tresoRiskValueRepository.findAll();
    }
    
}
