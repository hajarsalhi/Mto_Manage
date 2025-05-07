package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TresoCommissionRepository extends JpaRepository<Treso_Commission, Integer>{
    
}
