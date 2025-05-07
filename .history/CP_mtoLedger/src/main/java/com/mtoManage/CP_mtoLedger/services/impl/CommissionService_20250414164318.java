package com.mtoManage.CP_mtoLedger.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import com.mtoManage.CP_mtoLedger.repositories.TresoCommissionRepository;

@Service
public class CommissionService {

    @Autowired
    private TresoCommissionRepository tresoCommissionRepository;

    
    Optional<TresoCommission> getProductsCommissions() {
        return tresoCommissionRepository.findCommissionRate();
    }
    
}
