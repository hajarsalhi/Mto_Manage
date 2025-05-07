package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoProduct;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TresoProductRepository extends JpaRepository<TresoProduct, Integer> {
    
    @Query("SELECT tp.productDeviseFx FROM TresoProduct tp WHERE tp.productId = :id")
    String getDeviseById(Integer id);


    @Query("SELECT tp FROM TresoProduct tp WHERE tp.commissions IS EMPTY")
    List<TresoProduct> findProductsWithoutCommission();

    
} 