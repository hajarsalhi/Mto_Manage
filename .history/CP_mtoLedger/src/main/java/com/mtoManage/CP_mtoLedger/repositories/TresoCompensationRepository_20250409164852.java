package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCompensation;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TresoCompensationRepository extends JpaRepository<TresoCompensation, Integer> {

    @Query(value = "SELECT SUM(tc.n_compensation) from treso_compensation tc where n_product_id =: productId and tc.d_date = CURRENT_DATE -1 ", nativeQuery = true)
    BigDecimal findTotalJ_1CompensationByProductId(@Param("productId") Integer productId);
} 