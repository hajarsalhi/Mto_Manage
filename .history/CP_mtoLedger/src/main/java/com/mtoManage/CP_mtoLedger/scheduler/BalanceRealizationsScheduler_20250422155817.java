package com.mtoManage.CP_mtoLedger.scheduler;

import com.mtoManage.CP_mtoLedger.models.*;
import com.mtoManage.CP_mtoLedger.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.time.LocalTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class BalanceRealizationsScheduler {

    private final TresoTransactionRepository transactionRepository;
    private final TresoProductRepository productRepository;
    private final TresoCommissionRepository commissionRepository;
    private final TresoBalanceRepository balanceRepository;
    private final TresoCurrentBalanceRepository currentBalanceRepository;
    private final PartnerProductRepository partnerProductRepository;
    private final PartnerXRepository partnerXRepository;
    private final TresoSchedulerRepository schedulerRepository;
    private final TresoMessagesRepository messageRepository;

    // Run at 12:25 PM every day
     @Scheduled(cron = "0 59 15 * * ?")
    @Transactional
    public void setBalanceRealizations() {

        String schedulerName = "setBalanceRealisations";
        log.info("Start Balance Realizations");
        
        // Get the date to process (yesterday)
        LocalDate chosenDate = LocalDate.now().minusDays(1);
        log.info("Processing balance for date: {}", chosenDate);
        
        try {
            // Get bank deposit products
            List<Integer> bankDepositProducts = productRepository.findBankDepositProducts();
            log.info("Bank deposit products: {}", bankDepositProducts);
            
            // Check if yesterday's scheduler ran successfully
            boolean yesterdaySchedulerRan = checkYesterdayScheduler(chosenDate);
            if (!yesterdaySchedulerRan) {
                log.error("Yesterday's scheduler did not run successfully");
                // TODO: Implement notification system
                TresoScheduler scheduler = new TresoScheduler();
                scheduler.setDate(LocalDateTime.of(chosenDate, LocalTime.now()));
                scheduler.setSchedulerName(schedulerName);
                scheduler.setState(0);
                scheduler.setErrorType("Chronologique");
                scheduler.setErrorDesc("Yesterday's scheduler non Existent");
                schedulerRepository.save(scheduler);
                return;
            }
            
            // Check if today's scheduler has already run
            boolean todaySchedulerRan = checkTodayScheduler(chosenDate);
            if (todaySchedulerRan) {
                log.error("Today's scheduler has already run");
                TresoScheduler scheduler = new TresoScheduler();
                scheduler.setDate(LocalDateTime.of(chosenDate, LocalTime.now()));
                scheduler.setSchedulerName(schedulerName);
                scheduler.setState(1);
                scheduler.setErrorType("Chronologique");
                scheduler.setErrorDesc("Today's scheduler already run successfully");
                schedulerRepository.save(scheduler);
                return;
            }
            
            // Check transaction counts between Partner_X and Treso_Transactions
            if (chosenDate.equals(LocalDate.now())) {
                boolean transactionCountsMatch = checkTransactionCounts(chosenDate, bankDepositProducts);
                if (!transactionCountsMatch) {
                    log.error("Transaction counts do not match between Partner_X and Treso_Transactions");
                    TresoMessages message = new TresoMessages();
                    message.setDate(LocalDateTime.now());
                    message.setMessage("<i style=\"color:red\" class=\"fa fa-warning\"></i>  balance J-1 is incorrect");
                    messageRepository.save(message);
                    return;
                }
            }
            
            // Process daily balances
            processDailyBalances(chosenDate, bankDepositProducts);
            
            // Update real-time balances
            updateRealTimeBalances(bankDepositProducts);
            
            // Log success
            log.info("Balance realizations completed successfully for date: {}", chosenDate);
            // TODO: Implement notification system

            TresoScheduler scheduler = new TresoScheduler();
            scheduler.setDate(LocalDateTime.of(chosenDate, LocalTime.now()));
            scheduler.setSchedulerName(schedulerName);
            scheduler.setState(1);
            schedulerRepository.save(scheduler);
            
        } catch (Exception e) {
            log.error("Error in setBalanceRealizations scheduler", e);
            // TODO: Implement notification system
        }
    }
    
    private boolean checkYesterdayScheduler(LocalDate chosenDate) {
        LocalDate yesterday = chosenDate.minusDays(1);
        // Debug: Check what records exist for yesterday
        // Debug: Check what records exist for yesterday
        
        List<TresoScheduler> matchingSchedulers = schedulerRepository.findMatchingSchedulers(
            yesterday,
            yesterday.plusDays(1),
            "setBalanceRealisations",
            1
        );
        
        if (matchingSchedulers.isEmpty()) {
            log.info("No matching schedulers found for yesterday ({})", yesterday);
        } else {
            for (TresoScheduler scheduler : matchingSchedulers) {
                log.info("Found matching scheduler: date={}, name={}, state={}", 
                    scheduler.getDate(), scheduler.getSchedulerName(), scheduler.getState());
            }
        }
        
        return schedulerRepository.existsByDateAndNameAndState(
            yesterday, 
            "setBalanceRealisations", 
            1
        );
    }
    
    private boolean checkTodayScheduler(LocalDate chosenDate) {
        return schedulerRepository.existsByDateAndNameAndState(
            chosenDate, 
            "setBalanceRealisations", 
            1
        );
    }
    
    private boolean checkTransactionCounts(LocalDate chosenDate, List<Integer> bankDepositProducts) {
        LocalDateTime startOfDay = chosenDate.atStartOfDay();
        LocalDateTime endOfDay = chosenDate.plusDays(1).atStartOfDay();
        
        // Count transactions in Treso_Transactions
        long tresoTransactionCount = transactionRepository.countTransactionsBetweenDates(
            startOfDay, 
            endOfDay, 
            bankDepositProducts
        );
        
        // Count transactions in Partner_X
        long partnerXTransactionCount = partnerXRepository.countTransactionsBetweenDates(
            startOfDay, 
            endOfDay, 
            bankDepositProducts
        );
        
        log.info("Treso_Transactions count: {}, Partner_X count: {}", tresoTransactionCount, partnerXTransactionCount);
        
        return tresoTransactionCount >= partnerXTransactionCount;
    }
    
    private void processDailyBalances(LocalDate chosenDate, List<Integer> bankDepositProducts) {
        // Insert initial balance records for all active products
        List<TresoProduct> activeProducts = productRepository.findAllExceptSpecificIds(bankDepositProducts);
        for (TresoProduct product : activeProducts) {
            TresoBalance balance = new TresoBalance();
            balance.getId().setDate(chosenDate);
            balance.getId().setProductId(product.getProductId());
            balance.setProductName(product.getProductName());
            balance.setRealisationJ1(BigDecimal.ZERO);
            balance.setCompensationJ1(BigDecimal.ZERO);
            balance.setBalance(BigDecimal.ZERO);
            balance.setCompTheorique(BigDecimal.ZERO);
            balance.setCommissionJ1(BigDecimal.ZERO);
            balance.setModified(0);
            balance.setOriginalValue(null);
            balance.setAccessId(null);
            balance.setComputedBalance(BigDecimal.ZERO);
            
            balanceRepository.save(balance);
        }
        
        // Update realizations and commissions
        for (TresoProduct product : activeProducts) {
            // Calculate realizations (sum of transactions)
            BigDecimal realisationJ1 = transactionRepository.calculateTransactionSumForDateRange(
                chosenDate.minusDays(1).atStartOfDay(),
                chosenDate.atStartOfDay(),
                product.getProductId()
            );
            
            // Calculate commissions
            BigDecimal commissionRate = commissionRepository.findTauxCommission(product.getProductId())
                .map(TresoCommission::getTauxCommission)
                .orElse(BigDecimal.ZERO)
                .divide(new BigDecimal("100"), 2, BigDecimal.ROUND_HALF_UP);
            
            BigDecimal commissionJ1 = realisationJ1.multiply(commissionRate);
            
            // Update balance record
            TresoBalance balance = balanceRepository.findByDateAndProductId(chosenDate, product.getProductId());
            if (balance != null) {
                balance.setRealisationJ1(realisationJ1);
                balance.setCommissionJ1(commissionJ1);
                balanceRepository.save(balance);
            }
        }
        
        // Update balances
        for (TresoProduct product : activeProducts) {
            // Get previous day's balance
            TresoBalance previousBalance = balanceRepository.findByDateAndProductId(
                chosenDate.minusDays(1), 
                product.getProductId()
            );
            
            BigDecimal previousBalanceValue = previousBalance != null ? previousBalance.getBalance() : BigDecimal.ZERO;
            
            // Get current balance record
            TresoBalance currentBalance = balanceRepository.findByDateAndProductId(chosenDate, product.getProductId());
            if (currentBalance != null) {
                // Calculate new balance
                BigDecimal newBalance = previousBalanceValue
                    .subtract(currentBalance.getRealisationJ1())
                    .subtract(currentBalance.getCommissionJ1());
                
                currentBalance.setBalance(newBalance);
                currentBalance.setComputedBalance(newBalance);
                balanceRepository.save(currentBalance);
            }
        }
    }
    
    private void updateRealTimeBalances(List<Integer> bankDepositProducts) {
        LocalDate today = LocalDate.now();
        
        // Get all products except bank deposit
        List<TresoProduct> products = productRepository.findAllExceptSpecificIds(bankDepositProducts);
        
        for (TresoProduct product : products) {
            // Get today's balance
            TresoBalance todayBalance = balanceRepository.findByDateAndProductId(today, product.getProductId());
            
            if (todayBalance != null) {
                // Update current balance
                currentBalanceRepository.updateCurrentBalanceWithDate(
                    product.getProductId(),
                    todayBalance.getBalance(),
                    LocalDateTime.now()
                );
            }
        }
    }
} 