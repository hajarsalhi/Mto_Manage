package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoCompensation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CompensationRepository extends JpaRepository<TresoCompensation, Integer> {
    List<TresoCompensation> findByProductId(Integer productId);
    List<TresoCompensation> findByProductIdAndDateBetween(Integer productId, LocalDate startDate, LocalDate endDate);

    

} 