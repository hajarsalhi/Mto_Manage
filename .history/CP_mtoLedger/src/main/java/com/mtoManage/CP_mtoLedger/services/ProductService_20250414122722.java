package com.mtoManage.CP_mtoLedger.services;

import java.util.List;
import com.mtoManage.CP_mtoLedger.dto.ProductRequestAdd;
import com.mtoManage.CP_mtoLedger.dto.GetProductResponse;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;

public interface ProductService {

    String getDeviseproduct(Integer id);
    public boolean existsById(Integer id);
    List<GetProductResponse> getAllProducts();
    void createProduct(ProductRequestAdd product);
    public List<TresoProduct> getAllProductsList();
    public List<TresoProduct> getProductsWithoutCommission();
}
