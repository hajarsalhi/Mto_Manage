package com.mtoManage.CP_mtoLedger.services.impl;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BalanceSchedulerService {
    
    private static final Logger logger = LoggerFactory.getLogger(BalanceSchedulerService.class);
    
    @Autowired
    private TresoProductRepository productRepository;
    
    @Autowired
    private TresoBalanceRepository balanceRepository;
    
    @Scheduled(fixedRate = 900000) // 15 minutes in milliseconds
    public void fetchRecentBalances() {
        logger.info("Starting scheduled balance fetch at {}", LocalDateTime.now());
        
        try {
            // Get all active products
            List<TresoProduct> products = productRepository.findAll();
            
            for (TresoProduct product : products) {
                try {
                    // Get the most recent balance for each product
                    TresoBalance recentBalance = balanceRepository.findByProductId(product.getProductId());
                    
                    if (recentBalance != null) {
                        logger.info("Retrieved balance for product {}: {}", 
                            product.getProductName(), 
                            recentBalance.getBalance());
                    } else {
                        logger.warn("No balance found for product {}", product.getProductName());
                    }
                } catch (Exception e) {
                    logger.error("Error fetching balance for product {}: {}", 
                        product.getProductName(), 
                        e.getMessage());
                }
            }
            
            logger.info("Completed scheduled balance fetch at {}", LocalDateTime.now());
        } catch (Exception e) {
            logger.error("Error in scheduled balance fetch: {}", e.getMessage());
        }
    }
} 