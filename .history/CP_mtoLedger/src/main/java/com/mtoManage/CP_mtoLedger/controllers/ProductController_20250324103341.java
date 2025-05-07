package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.services.impl.ProductServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
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
    public ResponseEntity<String> getDeviseProductById(@PathVariable Integer id) {
        try{
            String Devise = productServiceImpl.getDeviseproduct(id);
            return ResponseEntity.ok(Devise);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching Product's Currency: " + e.getMessage());
        }
    }


} 