package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.dto.CurrentBalanceRequest;
import com.mtoManage.CP_mtoLedger.dto.BalanceResponse;
import com.mtoManage.CP_mtoLedger.dto.CorrectionsResponse;
import com.mtoManage.CP_mtoLedger.dto.BalanceForDashBoardRequest;
import com.mtoManage.CP_mtoLedger.dto.TransORCompResponse;
import com.mtoManage.CP_mtoLedger.dto.EditCurrentBalanceRequest;
import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoCompensation;
import com.mtoManage.CP_mtoLedger.models.TresoCorrection;
import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.models.TresoRiskValue;
import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import com.mtoManage.CP_mtoLedger.models.TresoBkam;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoBkamRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoTransactionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCompensationRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCorrectionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCurrentBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoRiskValueRepository;

import com.mtoManage.CP_mtoLedger.services.BalanceService;
import com.mtoManage.CP_mtoLedger.services.impl.BalanceServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;


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

    @Autowired
    private TresoCorrectionRepository correctionRepository;

    @Autowired
    private BalanceServiceImpl balanceService;

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
            //bShow de la table Product
            //response.setStatus(product.get == 1  ? "Active" : "Inactive");
            
            if (recentBalance != null) {
                response.setBalance(recentBalance.getCurrentBalance());
                response.setDateUpdate(recentBalance.getDateUpdate());
            }

            if (balanceJ_1 != null) {
                response.setBalanceJ_1(balanceJ_1.getBalance());
                response.setCompensationJ_1(balanceJ_1.getCompensationJ1());
                response.setTransactionJ_1(balanceJ_1.getRealisationJ1());
            
            }

            response.setDevise(product.getProductDeviseFx());
            
            
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
    
    @GetMapping("/transactions-compensations-history/{productId}")
    public ResponseEntity<?> getHistoriesOfTransactionsAndCompensationsByProductId(
            @PathVariable("productId") Integer productId
    ) {
        final LocalDateTime startDate = LocalDateTime.now().minusDays(1);
        final LocalDateTime endDate = LocalDateTime.now();
        List<TresoTransactions> transactions = transactionRepository.findTransactionsBetweenDates(startDate, endDate, productId);
        List<TresoCompensation> compensations = compensationRepository.findCompensationsBetweenDates(startDate, endDate, productId);

        HashMap<String, TransORCompResponse[]> result = new HashMap<>();
        result.put("transactions", transactions.stream().map(t -> 
                        new TransORCompResponse(t.getDate().toLocalDate(), t.getTransactionId(), t.getAmountDevise(), t.getTransactionCode(), "completed")).toArray(TransORCompResponse[]::new));
        result.put("compensations", compensations.stream().map(c -> 
                        new TransORCompResponse(c.getInsertion().toLocalDate(), c.getId(), c.getCompensation(), c.getReference(), "validated")).toArray(TransORCompResponse[]::new));

        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/edit/{balanceId}")
    public ResponseEntity<?> editCurrentBalance(
            @PathVariable("balanceId") Integer balanceId,
            @RequestBody EditCurrentBalanceRequest request
    ) {
        balanceService.updateBalances(balanceId, request);
        
        // Return the updated balance
        return ResponseEntity.ok().body("Balance updated successfully");
    }


    @GetMapping("/corrections")
    public ResponseEntity<List<CorrectionsResponse>> getCorrections() {

        List<TresoCorrection> corrections = correctionRepository.findAll();
        List<CorrectionsResponse> correctionResponses = new ArrayList<>();
        for (TresoCorrection correction : corrections) {
            CorrectionsResponse response = new CorrectionsResponse();
            TresoProduct product = productRepository.findById(correction.getProductId()).orElse(null);
            response.setId(correction.getId());
            response.setDate(correction.getDate().toLocalDate().toString());
            response.setMtoName(product.getProductName());
            response.setMtoId(correction.getProductId());
            response.setOldBalance(correction.getOldBalance());
            response.setCorrection(correction.getCorrection());
            response.setMotif(correction.getMotif());

            correctionResponses.add(response);
        }
        return ResponseEntity.ok(correctionResponses);
    }

}
