package com.mtoManage.CP_mtoLedger.scheduler;

import com.mtoManage.CP_mtoLedger.models.TresoLastIds;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdjustmentScheduler {
    private final TresoProductRepository productRepository;
    private final TresoLastIdsRepository lastIdsRepository;
    private final AjustDelRepository ajustDelRepository;
    private final TresoCommissionRepository commissionRepository;
    private final TresoCurrentBalanceRepository currentBalanceRepository;
    private final TresoTransactionRepository transactionRepository;
    private final TresoBalanceRepository balanceRepository;

    private static final String ADJUSTMENT_CONTEXT = "Ajust_del";
    private static final List<Integer> EXCLUDED_PRODUCT_IDS = Arrays.asList(5, 6, 22);

    //@Scheduled(fixedDelay = 240000) // 4 minutes = 240000 ms
    @Transactional
    public void processAdjustments() {
        log.info("Starting adjustment process at {}", LocalDateTime.now());
        
        try {
            // Get products excluding specific IDs
            List<TresoProduct> products = productRepository.findAllExceptSpecificIds(EXCLUDED_PRODUCT_IDS);
            
            // Get last processed ID
            TresoLastIds lastIds = lastIdsRepository.findByContext(ADJUSTMENT_CONTEXT);
            Integer lastId = lastIds != null ? lastIds.getLastId() : 0;
            
            // Get current last ID from Ajust_del
            Integer currentLastId = ajustDelRepository.findLastId();
            
            if (currentLastId == null || lastId.equals(currentLastId)) {
                log.info("No new adjustments to process");
                return;
            }

            // Process each product
            for (TresoProduct product : products) {
                try {
                    processProductAdjustment(product, lastId, currentLastId);
                } catch (Exception e) {
                    log.error("Error processing adjustment for product {}: {}", product.getProductId(), e.getMessage(), e);
                }
            }

            // Insert correction transactions
            insertCorrectionTransactions(lastId, currentLastId);

            // Update last processed ID
            lastIdsRepository.updateLastId(ADJUSTMENT_CONTEXT, currentLastId);
            
            log.info("Adjustment process completed successfully");
            
        } catch (Exception e) {
            log.error("Error in adjustment process: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void processProductAdjustment(TresoProduct product, Integer lastId, Integer currentLastId) {
        // Calculate sum of transactions
        BigDecimal transactionSum = ajustDelRepository.calculateTransactionSum(
            product.getProductId(), 
            lastId,
            currentLastId
        );

        if (transactionSum.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        // Get commission rate
        BigDecimal commissionRate = commissionRepository.findTauxCommission(product.getProductId())
            .map(commission -> commission.getTauxCommission().divide(new BigDecimal("100"), 2, BigDecimal.ROUND_HALF_UP))
            .orElse(BigDecimal.ZERO);

        BigDecimal adjustedAmount = transactionSum.multiply(BigDecimal.ONE.add(commissionRate));

        // Update current balance
        if (product.getBalanceProductId() != null) {
            currentBalanceRepository.updateCurrentBalanceWithDate(
                product.getBalanceProductId(),
                adjustedAmount,
                LocalDateTime.now()
            );
        }

        // Update daily balance
        balanceRepository.updateBalanceForDate(
            product.getProductId(),
            adjustedAmount,
            LocalDateTime.now().toLocalDate()
        );
    }

    private void insertCorrectionTransactions(Integer lastId, Integer currentLastId) {
        transactionRepository.insertCorrectionTransactions(lastId, currentLastId);
    }
}
