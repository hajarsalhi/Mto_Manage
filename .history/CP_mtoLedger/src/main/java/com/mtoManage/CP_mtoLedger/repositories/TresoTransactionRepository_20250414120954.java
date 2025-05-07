package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoTransactions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TresoTransactionRepository extends JpaRepository<TresoTransactions, Integer> {
    
    @Query("SELECT MAX(t.date) FROM TresoTransaction t WHERE t.productId NOT IN :bankDepositProducts")
    LocalDateTime findLastTransactionDate(@Param("bankDepositProducts") List<Integer> bankDepositProducts);

    @Query("SELECT SUM(t.amountDevise) FROM TresoTransaction t WHERE t.date > :lastTransactionDate AND t.productId = :productId AND t.correction = false")
    BigDecimal calculateTransactionSum(@Param("lastTransactionDate") LocalDateTime lastTransactionDate, @Param("productId") Integer productId);

    @Query("SELECT MAX(t.transactionId) FROM TresoTransaction t WHERE t.date > :lastTransactionDate AND t.productId = :productId AND t.correction = false")
    Integer findLastTransactionId(@Param("lastTransactionDate") LocalDateTime lastTransactionDate, @Param("productId") Integer productId);
} 