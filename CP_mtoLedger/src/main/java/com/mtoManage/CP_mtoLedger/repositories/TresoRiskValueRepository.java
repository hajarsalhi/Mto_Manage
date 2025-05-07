package com.mtoManage.CP_mtoLedger.repositories;
import com.mtoManage.CP_mtoLedger.models.TresoRiskValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TresoRiskValueRepository extends JpaRepository<TresoRiskValue, Integer> {
    
    Optional<TresoRiskValue> findTopByProductIdOrderByDateCreatedDesc(@Param("productId") Integer productId);
}