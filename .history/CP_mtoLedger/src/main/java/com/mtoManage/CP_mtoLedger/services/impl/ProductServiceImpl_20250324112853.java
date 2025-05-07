package com.mtoManage.CP_mtoLedger.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.services.ProductService;

@Service
public class ProductServiceImpl implements ProductService {


    @Autowired
    private TresoProductRepository productRepository;

    @Override
    public boolean existsById(Integer id) {
        return productRepository.existsById(id);
    }

    @Override
    public String getDeviseproduct(Integer id) {
        String devise = productRepository.getDeviseById(id);
        // Return default currency if none found
        return (devise != null && !devise.isEmpty()) ? devise : "USD";
    }
    
}
