package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoNotifications;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TresoNotificationRepository extends JpaRepository<TresoNotifications, Integer> {
    
    @Query("SELECT n.rate FROM TresoNotification n WHERE n.productId = :productId AND n.applyDate <= :date AND n.nextApplyDate >= :date")
    Optional<BigDecimal> findRateForDate(@Param("productId") Integer productId, @Param("date") LocalDateTime date);
} 