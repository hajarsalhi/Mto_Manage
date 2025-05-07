package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TresoCurrentBalanceRepository extends JpaRepository<TresoCurrentBalance, Integer> {
    
    @Modifying
    @Query("UPDATE TresoCurrentBalance c SET c.currentBalance = c.currentBalance - :amount, c.lastTrxId = :lastTrxId, c.dateUpdate = CURRENT_TIMESTAMP WHERE c.productId = :productId")
    void updateCurrentBalance(@Param("productId") Integer productId, @Param("amount") BigDecimal amount, @Param("lastTrxId") Integer lastTrxId);

    @Modifying
    @Query("UPDATE TresoCurrentBalance c SET c.currentBalance = :currentBalance, c.dateUpdate = :dateUpdate WHERE c.productId = :productId")
    void updateCurrentBalanceWithDate(
        @Param("productId") Integer productId,
        @Param("currentBalance") BigDecimal currentBalance,
        @Param("dateUpdate") LocalDateTime dateUpdate
    );

    @Query("SELECT c FROM TresoCurrentBalance c WHERE c.productId = :productId ORDER BY c.dateUpdate DESC")
    Optional<TresoCurrentBalance> findByProductId(@Param("productId") Integer productId);

    @Query("SELECT c.currentBalance FROM TresoCurrentBalance c WHERE c.productId = :productId ORDER BY c.dateUpdate DESC")
    Optional<BigDecimal> findPrevBalanceByProductId(@Param("productId") Integer productId);
}