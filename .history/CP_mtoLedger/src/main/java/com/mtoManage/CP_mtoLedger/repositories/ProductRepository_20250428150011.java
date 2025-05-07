package com.mtoManage.CP_mtoLedger.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mtoManage.CP_mtoLedger.models.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Custom query methods can be defined here if needed
    
    @Query("Select p from Product p where p.active = true")
    List<Product> findActiveProductsForReconciliation();
}
