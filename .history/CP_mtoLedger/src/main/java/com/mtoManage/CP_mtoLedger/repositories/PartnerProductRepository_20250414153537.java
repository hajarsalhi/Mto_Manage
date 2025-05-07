package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mtoManage.CP_mtoLedger.models.Product;

import java.util.List;

@Repository
public interface PartnerProductRepository extends JpaRepository<Product, Integer> {
    
    @Query("SELECT pp.productId FROM Product pp JOIN PartnerInfo pi ON pi.partnerId = pp.id WHERE pi.canSendBank = true AND (pi.canSendCash IS NULL OR pi.canSendCash = false)")
    List<Integer> findBankDepositProducts();
} 