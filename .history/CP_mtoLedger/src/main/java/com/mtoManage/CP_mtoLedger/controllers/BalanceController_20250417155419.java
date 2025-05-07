package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.dto.BalanceResponse;
import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoTransactionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCompensationRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCurrentBalanceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/balance")
@CrossOrigin(origins = "http://localhost:3000")
public class BalanceController {

    @Autowired
    private TresoProductRepository productRepository;

    @Autowired
    private TresoBalanceRepository balanceRepository;

    @Autowired
    private TresoCurrentBalanceRepository currentBalanceRepository;
    
    @Autowired
    private TresoCompensationRepository compensationRepository;
    
    @Autowired
    private TresoTransactionRepository transactionRepository;

    @GetMapping("/recent")
    public ResponseEntity<List<BalanceResponse>> getRecentBalances() {
        List<BalanceResponse> responses = new ArrayList<>();
        
        // Get all products
        List<TresoProduct> products = productRepository.findAll();
        
        for (TresoProduct product : products) {
            // Get the most recent balance for each product
            TresoCurrentBalance recentBalance = currentBalanceRepository.findByProductId(product.getProductId());
            
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

    @GetMapping("/day-before")
    public ResponseEntity<List<BalanceResponse>> getDayBeforeFinanceData() {
        List<BalanceResponse> responses = new ArrayList<>();
        
        // Get yesterday's date
        LocalDate yesterday = LocalDate.now().minusDays(1);
        
        // Get all products
        List<TresoProduct> products = productRepository.findAll();
        
        for (TresoProduct product : products) {
            
            TresoBalance j1Balance = balanceRepository.findJ_1BalanceByProductId(product.getProductId(), yesterday);
            
            BigDecimal j1Compensation = compensationRepository.findTotalJ_1CompensationByProductId(product.getProductId(), yesterday);
            if (j1Compensation == null) {
                j1Compensation = BigDecimal.ZERO;
            }

            BigDecimal j1Transaction = null;
            if (j1Transaction == null) {
                j1Transaction = BigDecimal.ZERO;
            }
        
            BalanceResponse response = new BalanceResponse();
            response.setProductId(product.getProductId());
            response.setProductName(product.getProductName());
            response.setStatus(j1Balance != null ? "AVAILABLE" : "NOT_AVAILABLE");
            
            if (j1Balance != null) {
                response.setBalance(j1Balance.getBalance());
                response.setDateUpdate(j1Balance.getDateUpdate());
                response.setBalanceJ_1(j1Balance.getBalance());
                response.setCompensationJ_1(j1Compensation);
                
                response.setTransactionJ_1(j1Transaction);
            }
            
            responses.add(response);
        }
        
        return ResponseEntity.ok(responses);
    }
}
