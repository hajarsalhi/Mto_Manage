package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TresoProductRepository extends JpaRepository<TresoProduct, Integer> {
    
    @Query("SELECT p FROM TresoProduct p WHERE p.productId NOT IN :excludedIds ORDER BY p.productId")
    List<TresoProduct> findAllExceptSpecificIds(@Param("excludedIds") List<Integer> excludedIds);

    @Query("SELECT tp.productDeviseFx FROM TresoProduct tp WHERE tp.productId = :id")
    String getDeviseById(Integer id);


    @Query("SELECT tp FROM TresoProduct tp WHERE tp.commissions IS EMPTY")
    List<TresoProduct> findProductsWithoutCommission();

    @Query("SELECT tp.productId FROM TresoProduct tp " +
           "JOIN PartnerInfo pi ON tp.productId = pi.partnerId " +
           "WHERE pi.canSendBank = 1 AND (pi.canSendCash IS NULL OR pi.canSendCash = 0)")
    List<Integer> findBankDepositProducts();

    @Query("Select p from TresoProduct p where p.sendReconciliationFile = true")
    List<TresoProduct> findActiveProductsForReconciliation();
    
    
} 