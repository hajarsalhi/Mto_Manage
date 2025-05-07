package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.AjustDel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface AjustDelRepository extends JpaRepository<AjustDel, Integer> {
    @Query("SELECT MAX(a.id) FROM AjustDel a")
    Integer findLastId();

    @Query(value = "SELECT ISNULL(SUM(t.nAmountDevise), 0) " +
           "FROM Ajust_del a " +
           "INNER JOIN Treso_Transactions t WITH (NOLOCK) ON t.nTransactionId = a.nTransactionId " +
           "WHERE t.nProductId = :productId " +
           "AND a.nId > :lastId " +
           "AND a.nId <= :currentLastId", nativeQuery = true)
    BigDecimal calculateTransactionSum(Integer productId, Integer lastId, Integer currentLastId);
}
