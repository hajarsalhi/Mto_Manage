package com.mtoManage.CP_mtoLedger.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;
import com.mtoManage.CP_mtoLedger.services.BalanceService;

@Service
public class BalanceServiceImpl implements BalanceService {

    @Autowired
    private TresoBalanceRepository balanceRepository;

    @Override
    public List<TresoBalance> getBalances() {
        return balanceRepository.findAll();
    }

    @Override
    public TresoBalance getBalanceByProductId(Integer productId) {
        return balanceRepository.findByProductId(productId);
    }
    
}
