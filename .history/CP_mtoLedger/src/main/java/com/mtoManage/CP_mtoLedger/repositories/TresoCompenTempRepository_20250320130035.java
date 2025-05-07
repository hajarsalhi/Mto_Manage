package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mtoManage.CP_mtoLedger.models.TresoCompenTemp;


@Repository
public interface TresoCompenTempRepository extends JpaRepository<TresoCompenTemp,Integer> {
    
}
