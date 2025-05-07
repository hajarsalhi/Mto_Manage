package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TresoCommissionRepository extends JpaRepository<TresoCommission, Integer> {
    
    @Query(value = "SELECT * FROM Treso_Commission WHERE Taux_commission IS NOT NULL", nativeQuery = true)
    Optional<List<TresoCommission>> findCommissionRate();


    @Query(value = "SELECT * FROM Treso_Commission WHERE Product_id = :productId", nativeQuery = true)
    Optional<TresoCommission> findTauxCommission(@Param("productId") Integer productId);
}
