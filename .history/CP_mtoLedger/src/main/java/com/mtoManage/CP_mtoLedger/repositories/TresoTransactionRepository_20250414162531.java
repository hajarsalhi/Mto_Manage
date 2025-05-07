package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TresoTransactionRepository extends JpaRepository<TresoTransactions, Integer> {
    
    @Query("SELECT MAX(t.date) FROM TresoTransactions t WHERE t.productId NOT IN :bankDepositProducts")
    LocalDateTime findLastTransactionDate(@Param("bankDepositProducts") List<Integer> bankDepositProducts);

    @Query("SELECT COALESCE(SUM(t.amountDevise), 0) FROM TresoTransactions t WHERE t.date > :lastTransactionDate AND t.productId = :productId AND t.correction = false")
    BigDecimal calculateTransactionSum(@Param("lastTransactionDate") LocalDateTime lastTransactionDate, @Param("productId") Integer productId);

    @Query("SELECT MAX(t.transactionId) FROM TresoTransactions t WHERE t.date > :lastTransactionDate AND t.productId = :productId AND t.correction = false")
    Integer findLastTransactionId(@Param("lastTransactionDate") LocalDateTime lastTransactionDate, @Param("productId") Integer productId);

    @Query("SELECT COUNT(t) FROM TresoTransactions t WHERE t.date BETWEEN :startDate AND :endDate AND t.productId NOT IN :excludedProductIds")
    long countTransactionsBetweenDates(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        List<Integer> excludedProductIds
    );
    
    @Query("SELECT t FROM TresoTransactions t WHERE t.date BETWEEN :startDate AND :endDate AND t.productId = :productId")
    List<TresoTransactions> findTransactionsBetweenDatesAndProduct(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("productId") Integer productId
    );

    @Query("SELECT COALESCE(SUM(t.amountDevise), 0) FROM TresoTransactions t WHERE t.date BETWEEN :startDate AND :endDate AND t.productId = :productId")
    BigDecimal calculateTransactionSumForDateRange(
        LocalDateTime startDate,
        LocalDateTime endDate,
        Integer productId
    );
} 