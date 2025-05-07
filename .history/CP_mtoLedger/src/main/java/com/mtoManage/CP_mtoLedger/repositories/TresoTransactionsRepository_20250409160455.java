package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface TresoTransactionsRepository extends JpaRepository<TresoTransactions, Integer> {
    
    @Query(value = "SELECT SUM(t.amount) FROM treso_transactions t WHERE t.product_id = :productId AND DATE(t.date) = DATE(DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY))")
    BigDecimal findTotalJ_1TransactionByProductId(@Param("productId") Integer productId);
} 