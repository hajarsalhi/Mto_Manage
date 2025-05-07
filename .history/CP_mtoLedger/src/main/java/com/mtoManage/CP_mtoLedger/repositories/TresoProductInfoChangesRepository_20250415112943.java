package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mtoManage.CP_mtoLedger.models.TresoProductInfoChanges;

public interface TresoProductInfoChangesRepository extends JpaRepository<TresoProductInfoChanges, Integer> {
    // Custom query methods can be defined here if needed
    
}
