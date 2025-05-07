package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.dto.GetCommissionResponse;
import com.mtoManage.CP_mtoLedger.dto.GetProductResponse;
import com.mtoManage.CP_mtoLedger.dto.ProductFinParams;
import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.services.impl.CommissionService;
import com.mtoManage.CP_mtoLedger.services.impl.ProductServiceImpl;

import org.apache.el.stream.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductServiceImpl productServiceImpl;

    @Autowired
    private CommissionService commissionService;

    @Autowired
    private TresoProductRepository tresoProductRepository;

    @GetMapping("/getProducts")
    public ResponseEntity<List<TresoProduct>> getAllProducts() {
        List<TresoProduct> products = productServiceImpl.getAllProductsList();
        return ResponseEntity.ok(products);
    }
    @GetMapping("/Without-commission")
    public ResponseEntity<List<TresoProduct>> getAllProductsWithoutCommission() {
        List<TresoProduct> products = productServiceImpl.getProductsWithoutCommission();
        return ResponseEntity.ok(products);
    }
    public ResponseEntity<List<GetProductResponse>> getAllProductsWithCommission() {
        List<GetProductResponse> products = productServiceImpl.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductFinParams> getProductById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok( productServiceImpl.getProductParamsById(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ProductFinParams());
        }
        
    }

    


    @PutMapping("/{id}")
    public ResponseEntity<TresoProduct> updateProduct(@PathVariable Integer id, @RequestBody TresoProduct product) {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }


    @GetMapping("/{id}/getDevise")
    public ResponseEntity<?> getDeviseProductById(@PathVariable Integer id) {
        try {
            // First check if the product exists
            if (!productServiceImpl.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Product with ID " + id + " not found"));
            }
            
            // Get the currency
            String devise = productServiceImpl.getDeviseproduct(id);
            
            // Check if currency is null or empty
            if (devise == null || devise.isEmpty()) {
                return ResponseEntity.status(HttpStatus.OK)
                    .body(Map.of("currency", "USD")); // Default currency if none found
            }
            
            return ResponseEntity.ok(Map.of("currency", devise));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error fetching Product's Currency: " + e.getMessage()));
        }
    }


    @GetMapping("/getProductCommission")
    public ResponseEntity<List<GetCommissionResponse>> getProductsCommissions() {
        List<TresoCommission> commissions = commissionService.getProductsCommissions()
            .orElseThrow(() -> new RuntimeException("No commissions found"));
        
        List<TresoProduct> products = productServiceImpl.getAllProductsList();
        List<GetCommissionResponse> commissionResponses = new ArrayList<>();

        for (TresoCommission commission : commissions) {
            
            GetCommissionResponse commissionResponse = new GetCommissionResponse();
            commissionResponse.setProductName(commission.getProductName());
            commissionResponse.setProductId(commission.getProductId());
            products.stream()
                .filter(product -> product.getProductName().equals(commission.getProductName()))
                .findFirst()
                .ifPresent(product -> commissionResponse.setIsActive(product.getActive()));
           
            commissionResponse.setTauxCommission(commission.getTauxCommission());
            commissionResponses.add(commissionResponse);
            System.out.println("Commission Response: " + commissionResponse);
        }
        return ResponseEntity.ok(commissionResponses);
    }

} 