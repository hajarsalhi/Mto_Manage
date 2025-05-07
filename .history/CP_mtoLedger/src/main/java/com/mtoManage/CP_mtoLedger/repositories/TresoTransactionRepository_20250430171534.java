package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
    BigDecimal calculateTransactionSum(
        @Param("lastTransactionDate") LocalDateTime lastTransactionDate,
        @Param("productId") Integer productId
    );

    @Query("SELECT MAX(t.transactionId) FROM TresoTransactions t WHERE t.date > :lastTransactionDate AND t.productId = :productId AND t.correction = false")
    Integer findLastTransactionId(
        @Param("lastTransactionDate") LocalDateTime lastTransactionDate,
        @Param("productId") Integer productId
    );

    @Query("SELECT COUNT(t) FROM TresoTransactions t WHERE t.date BETWEEN :startDate AND :endDate AND t.productId NOT IN :excludedProductIds")
    Long countTransactionsBetweenDates(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("excludedProductIds") List<Integer> excludedProductIds
    );
    
    @Query("SELECT t FROM TresoTransactions t WHERE t.date BETWEEN :startDate AND :endDate AND t.productId = :productId")
    List<TresoTransactions> findTransactionsBetweenDatesAndProduct(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("productId") Integer productId
    );

    @Query("SELECT COALESCE(SUM(t.amountDevise), 0) FROM TresoTransactions t WHERE t.date BETWEEN :startDate AND :endDate AND t.productId = :productId")
    BigDecimal calculateTransactionSumForDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("productId") Integer productId
    );

    

    @Modifying
    @Query(value = 
        "INSERT INTO Treso_Transactions (dDate, sTransactionCode, sTransactionInternalCode, " +
        "nAmountDH, nTransactionId, nProductId, sProductName, nTauxTheorique, nAmountDevise, " +
        "sSendCurrency, bCorrection) " +
        "SELECT t.dDate, 'COR' + t.sTransactionCode, t.sTransactionInternalCode, " +
        "t.nAmountDH * -1, 1700000000 + t.nTransactionId, t.nProductId, t.sProductName, " +
        "t.nTauxTheorique, t.nAmountDevise * -1, t.sSendCurrency, 1 " +
        "FROM Ajust_del a " +
        "INNER JOIN Treso_Transactions t WITH (NOLOCK) ON t.nTransactionId = a.nTransactionId " +
        "WHERE a.nId > :lastId AND a.nId <= :currentLastId", 
        nativeQuery = true)
    void insertCorrectionTransactions(@Param("lastId") Integer lastId, @Param("currentLastId") Integer currentLastId);

    @Query("SELECT t FROM TresoTransactions t WHERE t.date BETWEEN :startDate AND :endDate AND t.productId = :productId")
    List<TresoTransactions> findTransactionsBetweenDates(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("productId") Integer productId
    );

    @Query("Select t from TresoTransactions t where t.productId = :productId and FUNCTION('DATE', t.date) = :date")
    List<TresoTransactions> findByProductAndDate(
        @Param("productId") Integer productId,
        @Param("date") LocalDate date
    );

} 