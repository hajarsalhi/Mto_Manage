package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface TresoCurrentBalanceRepository extends JpaRepository<TresoCurrentBalance, Integer> {
    
    @Modifying
    @Query("UPDATE TresoCurrentBalance c SET c.currentBalance = c.currentBalance - :amount, c.lastTrxId = :lastTrxId, c.dateUpdate = CURRENT_TIMESTAMP WHERE c.productId = :productId")
    void updateCurrentBalance(@Param("productId") Integer productId, @Param("amount") BigDecimal amount, @Param("lastTrxId") Integer lastTrxId);

    @Modifying
    @Query("UPDATE TresoCurrentBalance c SET c.currentBalance = c.currentBalance + :amount, c.dateUpdate =: dateUpdate WHERE c.productId = :productId")
    void uupdateCurrentBalanceWithDate(
        @Param("productId") Integer productId,
        @Param("currentBalance") BigDecimal amount,
        @Param("dateUpdate") LocalDateTime dateUpdate
    );

    TresoCurrentBalance findByProductId(Integer productId);

    BigDecimal findPrevBalanceByProductId(Integer productId);

    
} 