package com.mtoManage.CP_mtoLedger.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mtoManage.CP_mtoLedger.models.TresoProduct;
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

    @Override
    @Transactional
    public List<TresoProduct> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public void createProduct(AddProductRequest product) {
        TresoProduct tresoProduct = productRepository.findByProductId(product.getProductId());
        tresoProduct.setDevise(product.getDevise());
        tresoProduct.setCommission(product.getCommission());
        
        tresoProduct.setActive(true);
        productRepository.save(tresoProduct);


    
}
