package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCompensation;
import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TresoCompensationRepository extends JpaRepository<TresoCompensation, Integer> {

    @Query("SELECT SUM(tc.compensation) FROM TresoCompensation tc WHERE tc.productId = :productId AND FUNCTION('DATE', tc.date) = :date")
    BigDecimal findTotalJ_1CompensationByProductId(@Param("productId") Integer productId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(tc.compensation), 0) FROM TresoCompensation tc WHERE tc.insertion BETWEEN :startDate AND :endDate AND tc.productId = :productId")
    BigDecimal calculateCompensationSumForDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("productId") Integer productId
    );

    List<TresoCurrentBalance> findCompensationsBetweenDates(LocalDate startDate, LocalDate endDate, Integer productId);
} 