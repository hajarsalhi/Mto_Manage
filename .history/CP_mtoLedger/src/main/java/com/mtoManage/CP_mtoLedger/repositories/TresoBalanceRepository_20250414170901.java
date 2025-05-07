package com.mtoManage.CP_mtoLedger.repositories;

import java.time.LocalDateTime;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;

@Repository
public interface TresoBalanceRepository extends JpaRepository<TresoBalance, Integer> {
    
    LocalDateTime yesterday = LocalDateTime.now().minusDays(1);

    @Query("SELECT tb FROM TresoBalance tb WHERE tb.id.productId = :productId ORDER BY tb.id.date DESC, tb.dateUpdate DESC")
    TresoBalance findByProductId(@Param("productId") Integer productId);
    
    @Query("SELECT tb FROM TresoBalance tb WHERE tb.id.productId = :productId AND FUNCTION('DATE', tb.dateUpdate) = :date")
    TresoBalance findJ_1BalanceByProductId(@Param("productId") Integer productId, @Param("date") LocalDate date);

    @Query("SELECT b FROM TresoBalance b WHERE b.id.date = :date AND b.id.productId = :productId")
    TresoBalance findByDateAndProductId(
        @Param("date") LocalDate date,
        @Param("productId") Integer productId
    );
    // Add any other custom query methods if needed
}
