package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.PartnerX;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PartnerXRepository extends JpaRepository<PartnerX, Integer> {
    
    @Query("SELECT p FROM PartnerX p WHERE p.paidDateTime > :startDate AND p.paidDateTime <= :endDate AND p.isPaid = true AND p.partnerId NOT IN :excludedIds")
    List<PartnerX> findPaidTransactionsBetween(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("excludedIds") List<Integer> excludedIds
    );


    @Query("SELECT COUNT(p) FROM PartnerX p WHERE p.paidDateTime > :startDate AND p.paidDateTime <= :endDate AND p.isPaid = true AND p.partnerId NOT IN :excludedIds")
    long countTransactionsBetweenDates(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        List<Integer> excludedProductIds
    );
} 
