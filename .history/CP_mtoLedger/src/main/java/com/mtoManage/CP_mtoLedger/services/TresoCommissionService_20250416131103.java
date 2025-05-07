package com.mtoManage.CP_mtoLedger.services;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import java.util.List;
import java.util.Optional;

public interface TresoCommissionService {
    List<TresoCommission> getAllCommissions();
    Optional<TresoCommission> getCommissionById(Integer id);
    Optional<TresoCommission> getCommissionByProductId(Integer productId);
    List<TresoCommission> getCommissionsWithRates();
    TresoCommission saveCommission(TresoCommission commission);
    void deleteCommission(Integer id);
    boolean existsById(Integer id);
} 