package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TresoCompenTempRepository extends JpaRepository<TresoCompenTempRepository,Integer> {
    
}
