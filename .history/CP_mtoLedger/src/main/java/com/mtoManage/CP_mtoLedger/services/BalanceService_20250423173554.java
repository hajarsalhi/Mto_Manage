package com.mtoManage.CP_mtoLedger.services;

import java.util.List;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.dto.EditCurrentBalanceRequest;

public interface BalanceService {
    List<TresoBalance> getBalances();
    TresoBalance getBalanceByProductId(Integer productId);
    void updateBalances(Integer productId, EditCurrentBalanceRequest request);
}
