package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.dto.CurrentBalanceRequest;
import com.mtoManage.CP_mtoLedger.dto.BalanceResponse;
import com.mtoManage.CP_mtoLedger.dto.BalanceForDashBoardRequest;
import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.models.TresoRiskValue;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoTransactionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCompensationRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCurrentBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoRiskValueRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


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

    @Autowired
    private TresoRiskValueRepository riskValueRepository;

    @GetMapping("/recent")
    public ResponseEntity<List<BalanceResponse>> getRecentBalances() {
        List<BalanceResponse> responses = new ArrayList<>();
        
        // Get all products
        List<TresoProduct> products = productRepository.findAll();
        
        for (TresoProduct product : products) {
            // Get the most recent balance for each product
            TresoCurrentBalance recentBalance = currentBalanceRepository.findByProductId(product.getProductId()).orElse(null);
            TresoBalance balanceJ_1 = balanceRepository.findByProductId(product.getProductId());

            BalanceResponse response = new BalanceResponse();
            response.setProductId(product.getProductId());
            response.setProductName(product.getProductName());
            response.setStatus(product.getActive() == 1  ? "Active" : "Inactive");
            
            if (recentBalance != null) {
                response.setBalance(recentBalance.getCurrentBalance());
                response.setDateUpdate(recentBalance.getDateUpdate());
            }

            if (balanceJ_1 != null) {
                response.setBalanceJ_1(balanceJ_1.getBalance());
                response.setCompensationJ_1(balanceJ_1.getCompensationJ1());
                response.setTransactionJ_1(balanceJ_1.getRealisationJ1());
            
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
        TresoCurrentBalance recentBalance = currentBalanceRepository.findByProductId(productId).orElse(null);
        
        BalanceResponse response = new BalanceResponse();
        response.setProductId(product.getProductId());
        response.setProductName(product.getProductName());
        response.setStatus(recentBalance != null ? "AVAILABLE" : "NOT_AVAILABLE");
        
        if (recentBalance != null) {
            response.setBalance(recentBalance.getCurrentBalance());
            response.setDateUpdate(recentBalance.getDateUpdate());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<List<BalanceForDashBoardRequest>> getBalanceForDashboard() {
        List<BalanceForDashBoardRequest> responses = new ArrayList<>();
        
        // Get all products
        List<TresoProduct> products = productRepository.findAll();
        
        for (TresoProduct product : products) {
            // Get the most recent balance for each product
            TresoCurrentBalance recentBalance = currentBalanceRepository.findByProductId(product.getProductId()).orElse(null);
            TresoRiskValue riskValue = riskValueRepository.findTopByProductIdOrderByDateCreatedDesc(product.getProductId()).orElse(null);
            TresoBalance balanceJ_1 = balanceRepository.findByProductId(product.getProductId());


            BalanceForDashBoardRequest response = new BalanceForDashBoardRequest();
            response.setProductId(product.getProductId());
            response.setProductName(product.getProductName());
            response.setStatus(product.getActive() == 1  ? "Active" : "Inactive");
            
            if (recentBalance != null) {
                response.setRealTimeBalance(recentBalance.getCurrentBalance());
                response.setDateUpdate(recentBalance.getDateUpdate());
            }
            
            if (balanceJ_1 != null) {
                response.setBalanceJ_1(balanceJ_1.getBalance());
            }

            if (riskValue != null) {
                response.setRiskValue(riskValue.getRiskValue());
            }
            
            responses.add(response);
        }
        
        return ResponseEntity.ok(responses);
    }  
    
    @GetMapping("/transactions-compensations-history")
    public ResponseEntity<?> getHistoriesOfTransactionsAndCompensationsByProductId(
            @RequestParam("productId") Integer productId
    ) {
        final LocalDate startDate = LocalDate.now().minusDays(1);
        final LocalDate endDate = LocalDate.now();
        List<TresoCurrentBalance> transactions = transactionRepository.findTransactionsBetweenDates(startDate, endDate, productId);
        List<TresoCurrentBalance> compensations = compensationRepository.findCompensationsBetweenDates(startDate, endDate, productId);

        return ResponseEntity.ok().body(new Object[]{transactions, compensations});
    }

}
