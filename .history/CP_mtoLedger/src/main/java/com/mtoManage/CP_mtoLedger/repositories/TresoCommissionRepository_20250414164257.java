package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TresoCommissionRepository extends JpaRepository<TresoCommission, Integer> {
    
    @Query("SELECT c.tauxCommission, c.productName FROM TresoCommission c WHERE c.tauxCommission IS NOT NULL")
    Optional<TresoCommission> findCommissionRate();
}
