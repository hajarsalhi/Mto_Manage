package com.mtoManage.CP_mtoLedger.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.repositories.TresoBkamRepository;

@Service
public class RateReferenceServiceImpl {
    
    @Autowired
    private TresoBkamRepository bkamRepository ;


    public void updateRateReference(RequestEntity<?> request) {

        TresoBkam  bkam = new TresoBkam();

        bkam.set
    }}
