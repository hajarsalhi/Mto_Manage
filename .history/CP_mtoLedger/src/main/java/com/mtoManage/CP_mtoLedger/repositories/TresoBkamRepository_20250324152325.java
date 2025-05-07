package com.mtoManage.CP_mtoLedger.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mtoManage.CP_mtoLedger.models.TresoBkam;

public interface TresoBkamRepository extends JpaRepository<TresoBkam , Integer> {

    @Query("SELECT t FROM TresoBkam t WHERE t.sDevise IN ('EUR', 'USD') " +
           "AND t.dDate = (SELECT MAX(t2.dDate) FROM TresoBkam t2 WHERE t2.sDevise = t.sDevise)")
    List<TresoBkam> findLatestEurAndUsdRates();
} 