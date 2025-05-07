package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.stereotype.Repository;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TresoCommissionRepository extends JpaRepository<TresoCommission, Integer>{
    
}
