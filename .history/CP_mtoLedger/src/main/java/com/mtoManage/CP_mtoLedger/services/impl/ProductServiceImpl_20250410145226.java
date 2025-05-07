package com.mtoManage.CP_mtoLedger.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.services.ProductService;
import com.mtoManage.CP_mtoLedger.dto.AddProductRequest;
import com.mtoManage.CP_mtoLedger.dto.GetProductResponse;


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
    public List<GetProductResponse> getAllProducts() {
        List<TresoProduct> productRepository.;
        List<GetProductResponse> productResponses = new ArrayList<>();
        for (TresoProduct product : productRepository) {
            //get the latest commission
            TresoCommission tresoCommission = product.getCommissions().get(0);
            productResponses.add(new GetProductResponse(product.getProductId(),product.getProductName(),product.getActive(),tresoCommission.getCommission()));
        }

        return productResponses;
    }

    @Override
    @Transactional
    public void createProduct(AddProductRequest product) {
        TresoProduct tresoProduct = productRepository.findById(product.getProductId()).orElseThrow();
        TresoCommission tresoComiission = new TresoCommission();
        tresoComiission.setCommission(product.getCommission());
        tresoComiission.setProduct(tresoProduct);
        tresoProduct.setProductDeviseFx(product.getDevise());

        tresoProduct.setActive(1);
        productRepository.save(tresoProduct);
    }


    
}
