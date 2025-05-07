package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnerProductRepository extends JpaRepository<PartnerProduct, Integer> {
    
    @Query("SELECT pp.productId FROM PartnerProduct pp JOIN PartnerInfo pi ON pp.partnerId = pi.id WHERE pi.canSendBank = true AND (pi.canSendCash IS NULL OR pi.canSendCash = false)")
    List<Integer> findBankDepositProducts();
} 