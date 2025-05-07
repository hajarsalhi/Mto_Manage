package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.dto.BalanceResponse;
import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/balances")
@CrossOrigin(origins = "*")
public class BalanceController {

    @Autowired
    private TresoProductRepository productRepository;

    @Autowired
    private TresoBalanceRepository balanceRepository;

    @GetMapping("/recent")
    public ResponseEntity<List<BalanceResponse>> getRecentBalances() {
        List<BalanceResponse> responses = new ArrayList<>();
        
        // Get all products
        List<TresoProduct> products = productRepository.findAll();
        
        for (TresoProduct product : products) {
            // Get the most recent balance for each product
            TresoBalance recentBalance = balanceRepository.findByProductId(product.getProductId());
            
            BalanceResponse response = new BalanceResponse();
            response.setProductId(product.getProductId());
            response.setProductName(product.getProductName());
            response.setStatus(recentBalance != null ? "AVAILABLE" : "NOT_AVAILABLE");
            
            if (recentBalance != null) {
                response.setBalance(recentBalance.getBalance());
                response.setDateUpdate(recentBalance.getDateUpdate());
            }
            
            responses.add(response);
        }
        
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<BalanceResponse> getBalanceByProductId(@PathVariable Integer productId) {
        // Get the product
        TresoProduct product = productRepository.findById(productId).orElse(null);
        
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Get the most recent balance for the product
        TresoBalance recentBalance = balanceRepository.findByProductId(productId);
        
        BalanceResponse response = new BalanceResponse();
        response.setProductId(product.getProductId());
        response.setProductName(product.getProductName());
        response.setStatus(recentBalance != null ? "AVAILABLE" : "NOT_AVAILABLE");
        
        if (recentBalance != null) {
            response.setBalance(recentBalance.getBalance());
            response.setDateUpdate(recentBalance.getDateUpdate());
        }
        
        return ResponseEntity.ok(response);
    }
}
