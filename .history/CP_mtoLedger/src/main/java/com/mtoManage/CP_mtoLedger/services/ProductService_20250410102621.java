package com.mtoManage.CP_mtoLedger.services;

import java.util.List;

import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.dto.AddProductRequest;

public interface ProductService {

    String getDeviseproduct(Integer id);
    public boolean existsById(Integer id);
    List<TresoProduct> getAllProducts();
    void createProduct(AddProductRequest product);
}
