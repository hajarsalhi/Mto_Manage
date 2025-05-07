package com.mtoManage.CP_mtoLedger.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.TresoCommissionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.services.ProductService;
import com.mtoManage.CP_mtoLedger.dto.GetProductResponse;
import com.mtoManage.CP_mtoLedger.dto.ProductFinParams;
import com.mtoManage.CP_mtoLedger.dto.ProductRequestAdd;


@Service
public class ProductServiceImpl implements ProductService {


    @Autowired
    private TresoProductRepository productRepository;
    @Autowired
    private TresoCommissionRepository commissionRepository;
    
    
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
    @Transactional(readOnly = true)
    public List<GetProductResponse> getAllProducts() {
        List<TresoProduct> products =  productRepository.findAll();
        List<GetProductResponse> productResponses = new ArrayList<>();
        for (TresoProduct product : products) {
            //get the latest commission
            TresoCommission tresoCommission = product.getCommissions().get(0);
            productResponses.add(new GetProductResponse
                (product.getProductId(),product.getProductName(),product.getActive(),tresoCommission.getTauxCommission()));
        }

        return productResponses;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductFinParams getProductParamsById(Integer id) {
        TresoProduct tresoProduct =  productRepository.findById(id).orElseThrow();
        TresoCommission tresoCommission = tresoProduct.getCommissions().get(0);
        return ProductFinParams.builder()
            .productId(tresoProduct.getProductId())
            .productName(tresoProduct.getProductName())
            .devise(tresoProduct.getProductDeviseFx())
            .active(tresoProduct.getActive())
            .prevTauxCommission(tresoCommission.getTauxCommission())
            .decote(tresoProduct.getDecote())
            .libDecote(tresoProduct.getLibDecote())
            .emails(tresoProduct.getEmail())
            .reconciliationEmails(tresoProduct.getEmailReconciliation())
            .sendReconciliationReports(tresoProduct.getSendReconciliationFile())
            .productsMethod(tresoProduct.getProductMethod())
            .applyHour(tresoProduct.getApplyHour())
            .build();

    }

    @Override
    public List<TresoProduct> getAllProductsList() {
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public void createProduct(ProductRequestAdd product) {
        TresoProduct tresoProduct = productRepository.findById(product.getProductId()).orElseThrow();
        TresoCommission tresoComiission = new TresoCommission();
        tresoComiission.setTauxCommission(product.getCommission());
        tresoComiission.setProduct(tresoProduct);
        tresoProduct.setProductDeviseFx(product.getDevise());

        tresoProduct.setActive(1);
        productRepository.save(tresoProduct);
    }

    @Override
    public List<TresoProduct> getProductsWithoutCommission() {
        return productRepository.findProductsWithoutCommission();
    }

    public void updateProduct(Integer id, ProductFinParams product) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateProduct'");
    }

    

    
}
