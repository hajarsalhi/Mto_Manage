package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoLastIds;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TresoLastIdsRepository extends JpaRepository<TresoLastIds, String> {
    TresoLastIds findByContext(String context);

    @Modifying
    @Transactional
    @Query("UPDATE TresoLastIds t SET t.lastId = :lastId WHERE t.context = :context")
    void updateLastId(String context, Integer lastId);
}
