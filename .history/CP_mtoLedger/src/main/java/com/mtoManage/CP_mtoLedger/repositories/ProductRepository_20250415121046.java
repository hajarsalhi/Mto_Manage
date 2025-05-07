package com.mtoManage.CP_mtoLedger.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mtoManage.CP_mtoLedger.models.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Custom query methods can be defined here if needed
    
}
