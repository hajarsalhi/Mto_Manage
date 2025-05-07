package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;

public interface TresoBalanceRepository extends JpaRepository<TresoBalance , Integer> {
    
    @Query("SELECT tb FROM TresoBalance tb WHERE tb.id.productId = :productId ORDER BY tb.id.date DESC, tb.dateUpdate DESC")
    TresoBalance findByProductId(@Param("productId") Integer productId);
    
    @Query(value = "SELECT tb.n_balance from treso_balance tb where tp.n_product_id = productId and tb.date = CURRENT_DATE-1 ", nativeQuery = true)
    TresoBalance findJ_1BalanceByProductId(@Param("productId") Integer productId);
    // Add any other custom query methods if needed
}
