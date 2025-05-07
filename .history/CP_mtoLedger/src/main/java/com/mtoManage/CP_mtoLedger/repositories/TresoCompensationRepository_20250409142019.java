package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCompensation;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TresoCompensationRepository extends JpaRepository<TresoCompensation, Integer> {

    @Query("SELECT SUM(tc.compensationAmount) FROM TresoCompensation tc WHERE tc.productId = :productId and DATE (tc.dDate) = DATE (CURRENT_DATE - INTERVAL 1 DAY)")
    BigDecimal findTotalJ_1CompensationByProductId(Integer productId);
} 