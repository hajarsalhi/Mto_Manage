package com.mtoManage.CP_mtoLedger.repositories;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;

public interface TresoBalanceRepository extends JpaRepository<TresoBalance , Integer> {
    

    LocalDateTime yesterday = LocalDateTime.now().minusDays(1);



    @Query("SELECT tb FROM TresoBalance tb WHERE tb.id.productId = :productId ORDER BY tb.id.date DESC, tb.dateUpdate DESC")
    TresoBalance findByProductId(@Param("productId") Integer productId);
    
    @Query(value = "SELECT * FROM treso_balance tb WHERE tb.n_product_id = :productId AND DATE(tb.d_date_update) = DATE(DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY))", nativeQuery = true)
    TresoBalance findJ_1BalanceByProductId(@Param("productId") Integer productId);
    // Add any other custom query methods if needed
}
