package com.mtoManage.CP_mtoLedger.scheduler;

import com.mtoManage.CP_mtoLedger.models.*;
import com.mtoManage.CP_mtoLedger.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BalanceRealTimeScheduler {

    private final TresoTransactionRepository transactionRepository;
    private final TresoProductRepository productRepository;
    private final TresoCommissionRepository commissionRepository;
    private final TresoCurrentBalanceRepository currentBalanceRepository;
    private final PartnerProductRepository partnerProductRepository;
    private final PartnerInfoRepository partnerInfoRepository;
    private final TresoNotificationsRepository notificationRepository;
    private final PartnerXRepository partnerXRepository;
    private final TresoSchedulerRepository schedulerRepository;

    @Scheduled(fixedRate = 300000) // Run every 5 minutes
    @Transactional
    public void setBalanceRealTime() {
        log.info("Start Current Balance");
        try {
            // Get bank deposit products
            List<Integer> bankDepositProducts = productRepository.findBankDepositProducts();
            log.info("Bank deposit products: {}", bankDepositProducts);

            // Get all products except bank deposit and specific IDs
            List<TresoProduct> products = productRepository.findAllExceptSpecificIds(bankDepositProducts);
            log.info("Found {} products to process", products.size());

            // Get last transaction date
            LocalDateTime lastTransactionDate = transactionRepository.findLastTransactionDate(bankDepositProducts);
            log.info("Last transaction date: {}", lastTransactionDate);

            // Process transactions from Partner_X
            processPartnerXTransactions(lastTransactionDate, bankDepositProducts);

            // Calculate and update balances
            updateBalances(products, lastTransactionDate);

            // Check for transaction delay
            checkTransactionDelay(lastTransactionDate);

            log.info("Finish setBalanceRealTime");
            // keep a record of the scheduler execution
            TresoScheduler scheduler = new TresoScheduler();
            scheduler.setDate(LocalDateTime.now());
            scheduler.setSchedulerName("setBalanceRealTime");
            scheduler.setState(1);
    
            schedulerRepository.save(scheduler);

        } catch (Exception e) {
            
            log.error("Error in setBalanceRealTime scheduler", e);

            // keep a record of the scheduler execution with error
            TresoScheduler scheduler = new TresoScheduler();
            scheduler.setDate(LocalDateTime.now());
            scheduler.setSchedulerName("setBalanceRealTime");
            scheduler.setState(0);
            scheduler.setErrorDesc(e.getMessage().substring(0, 255));
    
            schedulerRepository.save(scheduler);
        }
    }

    private void processPartnerXTransactions(LocalDateTime lastTransactionDate, List<Integer> bankDepositProducts) {
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime fiveMinutesAgo = currentTime.minusMinutes(30);

        List<PartnerX> partnerTransactions = partnerXRepository.findPaidTransactionsBetween(
            lastTransactionDate,
            fiveMinutesAgo,
            bankDepositProducts
        );

        for (PartnerX transaction : partnerTransactions) {
            TresoTransactions tresoTransaction = new TresoTransactions();
            tresoTransaction.setDate(transaction.getPaidDateTime());
            tresoTransaction.setTransactionCode(transaction.getTrackingNumber());
            tresoTransaction.setTransactionInternalCode(transaction.getInternalTrackingNumber());
            tresoTransaction.setAmountDH(transaction.getReceiveAmount());
            tresoTransaction.setTransactionId(transaction.getTransactionId());
            tresoTransaction.setProductId(transaction.getPartnerId());
            // Get product name from the product repository
            TresoProduct product = productRepository.findById(transaction.getPartnerId()).orElse(null);
            if (product != null) {
                tresoTransaction.setProductName(product.getProductName());
            }

            // Get rate from notifications or use default
            BigDecimal rate = notificationRepository.findRateForDate(
                transaction.getPartnerId(),
                transaction.getPaidDateTime()
            ).orElse(new BigDecimal("12"));

            tresoTransaction.setTauxTheorique(rate);
            tresoTransaction.setAmountDevise(
                transaction.getSendAmount().divide(rate, 2, BigDecimal.ROUND_HALF_UP)
            );
            tresoTransaction.setSendCurrency(transaction.getSendCurrency());

            transactionRepository.save(tresoTransaction);
        }
    }

    private void updateBalances(List<TresoProduct> products, LocalDateTime lastTransactionDate) {
        for (TresoProduct product : products) {
            try {
                // Calculate sum of transactions
                BigDecimal transactionSum = transactionRepository.calculateTransactionSum(
                    lastTransactionDate,
                    product.getProductId()
                );

                if (transactionSum.compareTo(BigDecimal.ZERO) == 0) {
                    continue;
                }

                // Get commission rate
                BigDecimal commissionRate = commissionRepository.findTauxCommission(product.getProductId())
                    .map(TresoCommission::getTauxCommission)
                    .orElse(BigDecimal.ZERO)
                    .divide(new BigDecimal("100"), 2, BigDecimal.ROUND_HALF_UP);

                // Get last transaction ID
                Integer lastTransactionId = transactionRepository.findLastTransactionId(
                    lastTransactionDate,
                    product.getProductId()
                );

                if (lastTransactionId != null) {
                    // Update current balance
                    currentBalanceRepository.updateCurrentBalance(
                        product.getBalanceProductId(),
                        transactionSum.multiply(BigDecimal.ONE.add(commissionRate)),
                        lastTransactionId
                    );
                }

                // TODO: Implement monitorBalanceProduct
                // monitorBalanceProduct(product.getProductId());

            } catch (Exception e) {
                log.error("Error updating balance for product {}: {}", product.getProductId(), e.getMessage());
            }
        }
    }

    private void checkTransactionDelay(LocalDateTime lastTransactionDate) {
        LocalDateTime now = LocalDateTime.now();
        int hoursDifference = (int) java.time.Duration.between(lastTransactionDate, now).toHours();

        if (now.getHour() > 11 && now.getHour() < 22 && hoursDifference > 4) {
            log.warn("No transaction has been added for 4H");
            // TODO: Implement email notification system
        }
    }
} 