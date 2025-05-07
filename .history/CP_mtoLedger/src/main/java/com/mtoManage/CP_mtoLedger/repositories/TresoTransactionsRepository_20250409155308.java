package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface TresoTransactionsRepository extends JpaRepository<TresoTransactions, Integer> {
    
    @Query("SELECT SUM(t.amount) FROM TresoTransactions t WHERE t.productId = :productId AND FUNCTION('DATE', t.date) = FUNCTION('DATE', CURRENT_DATE - 1)")
    BigDecimal findTotalJ_1TransactionByProductId(@Param("productId") Integer productId);
} 