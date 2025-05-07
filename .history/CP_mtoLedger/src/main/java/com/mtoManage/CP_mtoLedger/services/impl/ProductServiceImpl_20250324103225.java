package com.mtoManage.CP_mtoLedger.services.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.services.ProductService;

@Service
public class ProductServiceImpl implements ProductService {


    @Autowired
    private TresoProductRepository productRepository;

    @Override
    public String getDeviseproduct(Integer id) {
        return productRepository.getDeviseById(id);
    }
    
}
