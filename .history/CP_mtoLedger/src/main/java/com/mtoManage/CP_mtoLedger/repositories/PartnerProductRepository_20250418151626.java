package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mtoManage.CP_mtoLedger.models.Product;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;

import java.util.List;

@Repository
public interface PartnerProductRepository extends JpaRepository<Product, Integer> {
    
    @Query("SELECT pp.id FROM TresoProduct pp JOIN PartnerInfo pi ON pi.partnerId = pp.productId WHERE pi.canSendBank = true AND (pi.canSendCash IS NULL OR pi.canSendCash = false)")
    List<Integer> findBankDepositProducts();

    @Query("SELECT pp FROM Product pp where pp.active = true AND pp.id NOT IN :excludedIds ORDER BY pp.id")
    List<TresoProduct>findAllActiveExceptSpecificIds(List<Integer> excludedIds);
} 