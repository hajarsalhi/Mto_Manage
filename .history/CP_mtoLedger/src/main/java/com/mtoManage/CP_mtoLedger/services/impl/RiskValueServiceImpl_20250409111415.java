package com.mtoManage.CP_mtoLedger.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        tresoRiskValue.setDateStart(LocalDateTime.of(request.getValidateFrom(), LocalTime.now()));
        tresoRiskValue.setDateEnd(LocalDateTime.of(request.getValidateTo(), LocalTime.now()));
        tresoRiskValue.setDateCreated(LocalDateTime.now());

        tresoRiskValueRepository.save(tresoRiskValue);
    }

    @Transactional
    public HashMap<TresoRiskValue , String> getRiskValues() {
        HashMap<TresoRiskValue , String> riskValues = new HashMap<>();
        for (TresoRiskValue riskValue : tresoRiskValueRepository.findAll()) {
            riskValues.put(riskValue, calculStateRiskValue(riskValue.getDateStart(), riskValue.getDateEnd()));
        }
        return riskValues;
    }
    

    public String calculStateRiskValue(LocalDateTime dateStart , LocalDateTime dateEnd) {
        
            if (dateStart.isBefore(LocalDateTime.now()) && dateEnd.isAfter(LocalDateTime.now())) {
                return "Pending";
            } else if((dateStart.isEqual(LocalDateTime.now()) || dateStart.isAfter(LocalDateTime.now())) && dateEnd.isAfter(LocalDateTime.now())) {
                return "Active";
            } else if(dateEnd.isBefore(LocalDateTime.now())) {
                return "Expired";
            } else {
                return "Unknown"; 
            }
        
    }
}
