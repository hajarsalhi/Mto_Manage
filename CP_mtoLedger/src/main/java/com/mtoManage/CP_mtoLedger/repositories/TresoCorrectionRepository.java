package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mtoManage.CP_mtoLedger.models.TresoCorrection;

public interface TresoCorrectionRepository extends JpaRepository<TresoCorrection, Integer> {
    // Custom query methods can be defined here if needed
    // For example, to find corrections by product ID:
    // List<TresoCorrection> findByProductId(Integer productId);
    
}
