package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.services.impl.ProductServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductServiceImpl productServiceImpl;

    @GetMapping
    public ResponseEntity<List<TresoProduct>> getAllProducts() {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TresoProduct> getProductById(@PathVariable Integer id) {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<TresoProduct> createProduct(@RequestBody TresoProduct product) {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
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


} 