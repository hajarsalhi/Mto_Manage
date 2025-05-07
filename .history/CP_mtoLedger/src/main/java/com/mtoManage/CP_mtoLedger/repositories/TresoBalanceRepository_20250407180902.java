package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;

public interface TresoBalanceRepository extends JpaRepository<TresoBalance , Integer> {
    
    @Query("SELECT b FROM TresoBalance b WHERE (Select b.product from TresoBalance b) = (Select p from TresoProduct p where p.id = :productId)")
    TresoBalance findByProductId(Integer productId);
    
    // Add any other custom query methods if needed
}
