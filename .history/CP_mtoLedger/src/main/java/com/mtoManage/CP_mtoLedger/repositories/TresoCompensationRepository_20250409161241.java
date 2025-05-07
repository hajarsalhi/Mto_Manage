package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCompensation;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TresoCompensationRepository extends JpaRepository<TresoCompensation, Integer> {

    @Query(value = "SELECT SUM(tc.nCompensation) FROM treso_compensation tc WHERE tc.product_id = :productId AND DATE(tc.date) = DATE(DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY))", nativeQuery = true)
    BigDecimal findTotalJ_1CompensationByProductId(@Param("productId") Integer productId);
} 