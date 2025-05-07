package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;

public interface TresoBalanceRepository extends JpaRepository<TresoBalance , Integer> {
    
    TresoBalance findByProductId(Integer productId);
    
    // Add any other custom query methods if needed
}
