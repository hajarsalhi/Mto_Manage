package com.mtoManage.CP_mtoLedger.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.dto.RateReferenceUpdateRequest;
import com.mtoManage.CP_mtoLedger.models.TresoBkam;
import com.mtoManage.CP_mtoLedger.repositories.TresoBkamRepository;

@Service
public class RateReferenceServiceImpl {
    
    @Autowired
    private TresoBkamRepository bkamRepository ;


    public void updateRateReference(RateReferenceUpdateRequest request) {

        TresoBkam  bkam = new TresoBkam();

        bkam.setDate(LocalDateTime.now());
        bkam.setFCoursVirement(request.getRate());
        bkam.setDevise(request.getCurrency());
        bkam.setDate(LocalDateTime.now());
        if(request.getSource().equals("MANUAL"))
             bkam.setSSource("CashPlus");
        bkam.setDDateBkam(LocalDateTime.now().plusDays(1));
        bkam.setSCreatedBy("Admin");
        bkamRepository.save(bkam);

    }

    public List<TresoBkam> getLatestBkam() {
        return bkamRepository.findLatestEurAndUsdRates();
    }

    public List<TresoBkam> getTwoLatestEurAndUsdRates() {
        return bkamRepository.findTwoLatestEurAndUsdRates();
    }



}


