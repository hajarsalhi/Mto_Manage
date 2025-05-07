package com.mtoManage.CP_mtoLedger.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mtoManage.CP_mtoLedger.models.TresoBkam;

@Repository
public interface TresoBkamRepository extends JpaRepository<TresoBkam, Integer> {

    @Query("SELECT t FROM TresoBkam t WHERE t.devise IN ('EUR', 'USD') " +
           "AND t.dDate = (SELECT MAX(t2.dDate) FROM TresoBkam t2 WHERE t2.devise = t.devise)")
    List<TresoBkam> findLatestEurAndUsdRates();

    Optional<TresoBkam> findTopByDeviseOrderByDateDesc(String devise);
} 