package com.mtoManage.CP_mtoLedger.services;

import java.util.List;
import com.mtoManage.CP_mtoLedger.dto.AddProductRequest;
import com.mtoManage.CP_mtoLedger.dto.GetProductResponse;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;

public interface ProductService {

    String getDeviseproduct(Integer id);
    public boolean existsById(Integer id);
    List<GetProductResponse> getAllProducts();
    void createProduct(AddProductRequest product);
    public List<TresoProduct> getAllProductsList();
    public List<TresoProduct> getProductsWithoutCommission();
}
