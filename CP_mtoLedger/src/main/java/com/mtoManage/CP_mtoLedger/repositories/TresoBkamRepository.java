package com.mtoManage.CP_mtoLedger.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mtoManage.CP_mtoLedger.models.TresoBkam;

@Repository
public interface TresoBkamRepository extends JpaRepository<TresoBkam, Integer> {

    @Query("SELECT t FROM TresoBkam t WHERE t.devise IN ('EUR', 'USD') " +
           "AND t.date >= (SELECT MAX(t2.date) FROM TresoBkam t2 WHERE t2.devise = t.devise AND t2.date < " +
           "(SELECT MAX(t3.date) FROM TresoBkam t3 WHERE t3.devise = t.devise))")
    List<TresoBkam> findTwoLatestEurAndUsdRates();
    
    @Query("SELECT t FROM TresoBkam t WHERE t.devise IN ('EUR', 'USD') " +
           "AND t.date = (SELECT MAX(t2.date) FROM TresoBkam t2 WHERE t2.devise = t.devise)")
    List<TresoBkam> findLatestEurAndUsdRates();

    @Query("SELECT b FROM TresoBkam b WHERE b.devise = :devise AND b.date = (SELECT MAX(b2.date) FROM TresoBkam b2 WHERE b2.devise = :devise)")
    Optional<TresoBkam> findLatestByDevise(@Param("devise") String devise);

} 