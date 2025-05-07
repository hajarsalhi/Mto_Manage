package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCompensation;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TresoCompensationRepository extends JpaRepository<TresoCompensation, Integer> {

    @Query("SELECT SUM(tc.compensation) FROM TresoCompensation tc WHERE tc.productId = :productId AND FUNCTION('DATE', tc.dDate) = FUNCTION('DATE', FUNCTION('DATE_SUB', CURRENT_DATE, 1))")
    BigDecimal findTotalJ_1CompensationByProductId(@Param("productId") Integer productId);
} 