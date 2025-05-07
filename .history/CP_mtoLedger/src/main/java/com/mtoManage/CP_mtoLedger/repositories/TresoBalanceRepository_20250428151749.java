package com.mtoManage.CP_mtoLedger.repositories;

import java.time.LocalDateTime;
import java.util.Optional;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import com.mtoManage.CP_mtoLedger.models.TresoBalance;

@Repository
public interface TresoBalanceRepository extends JpaRepository<TresoBalance, Integer> {
    
    LocalDateTime yesterday = LocalDateTime.now().minusDays(1);

    @Query("SELECT tb FROM TresoBalance tb WHERE tb.id.productId = :productId ORDER BY tb.id.date DESC, tb.dateUpdate DESC LIMIT 1")
    TresoBalance findByProductId(@Param("productId") Integer productId);
    
    @Query("SELECT tb FROM TresoBalance tb WHERE tb.id.productId = :productId AND FUNCTION('DATE', tb.dateUpdate) = :date")
    TresoBalance findJ_1BalanceByProductId(@Param("productId") Integer productId, @Param("date") LocalDate date);

    @Query("SELECT b FROM TresoBalance b WHERE b.id.date = :date AND b.id.productId = :productId")
    TresoBalance findByDateAndProductId(
        @Param("date") LocalDate date,
        @Param("productId") Integer productId
    );


    @Modifying
    @Query("UPDATE TresoBalance b SET b.balance = b.balance + :amount, b.modified = 1 " +
           "WHERE b.id.productId = :productId AND b.id.date = :date")
    void updateBalanceForDate(@Param("productId") Integer productId, @Param("amount") BigDecimal amount, @Param("date") LocalDate date);

    @Query("SELECT tb FROM TresoBalance tb WHERE tb.id.productId = :productId AND tb.id.date = :date")
    Optional <TresoBalance> findByProductAndDate(@Param("productId") Integer productId,  @Param("date") LocalDate date) ;
        
    
}
