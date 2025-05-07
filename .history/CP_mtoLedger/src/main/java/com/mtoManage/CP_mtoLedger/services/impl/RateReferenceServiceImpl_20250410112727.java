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


    public void updateRateReference(RateReferenceRequest request) {

        TresoBkam  bkam = new TresoBkam();

        bkam.setDate(LocalDateTime.now());
        bkam.setFCoursVirement(new BigDecimal(request.getRate()));
        bkam.setDevise(request.getCurrency());
        bkam.setDate(LocalDateTime.now());
        if(request.getSource().equals("MANUAL"))
             bkam.setSSource("CashPlus");

        bkamRepository.save(bkam);

    }

    public List<TresoBkam> getLatestBkam() {
        return bkamRepository.findLatestEurAndUsdRates();
    }



}


