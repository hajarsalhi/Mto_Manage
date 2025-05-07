package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface TresoTransactionsRepository extends JpaRepository<TresoTransactions, Integer> {
    
    @Query(value = "SELECT SUM(t.n_amount) FROM treso_transactions t WHERE t.n_product_id = :productId AND DATE(t.d_date) = DATE(DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY))", nativeQuery = true)
    BigDecimal findTotalJ_1TransactionByProductId(@Param("productId") Integer productId);
} 