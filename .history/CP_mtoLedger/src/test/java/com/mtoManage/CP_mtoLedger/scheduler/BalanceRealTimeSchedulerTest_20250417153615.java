package com.mtoManage.CP_mtoLedger.scheduler;

import com.mtoManage.CP_mtoLedger.models.*;
import com.mtoManage.CP_mtoLedger.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BalanceRealTimeSchedulerTest {

    @Mock
    private TresoTransactionRepository transactionRepository;

    @Mock
    private TresoProductRepository productRepository;

    @Mock
    private TresoCommissionRepository commissionRepository;

    @Mock
    private TresoCurrentBalanceRepository currentBalanceRepository;

    @Mock
    private PartnerProductRepository partnerProductRepository;

    @Mock
    private PartnerInfoRepository partnerInfoRepository;

    @Mock
    private TresoNotificationsRepository notificationRepository;

    @Mock
    private PartnerXRepository partnerXRepository;

    @InjectMocks
    private BalanceRealTimeScheduler balanceRealTimeScheduler;

    private List<Integer> bankDepositProducts;
    private List<TresoProduct> products;
    private LocalDateTime lastTransactionDate;
    private PartnerX samplePartnerX;
    private TresoProduct sampleProduct;
    private TresoCommission sampleCommission;

    @BeforeEach
    void setUp() {
        // Setup test data
        bankDepositProducts = Arrays.asList(1, 2);
        lastTransactionDate = LocalDateTime.now().minusHours(1);
        
        // Setup sample product
        sampleProduct = new TresoProduct();
        sampleProduct.setProductId(1);
        sampleProduct.setProductName("Test Product");
        sampleProduct.setBalanceProductId(1);
        products = Arrays.asList(sampleProduct);

        // Setup sample commission
        sampleCommission = new TresoCommission();
        sampleCommission.setTauxCommission(new BigDecimal("2.5"));
        sampleCommission.setProductId(1);

        // Setup sample PartnerX transaction
        samplePartnerX = new PartnerX();
        samplePartnerX.setPaidDateTime(LocalDateTime.now());
        samplePartnerX.setTrackingNumber("TRACK123");
        samplePartnerX.setInternalTrackingNumber("INT123");
        samplePartnerX.setReceiveAmount(new BigDecimal("1000"));
        samplePartnerX.setDataJson("TRANS123");
        samplePartnerX.setPartnerId(1);
        samplePartnerX.setSendAmount(new BigDecimal("100"));
        samplePartnerX.setSendCurrency("USD");
    }

    @Test
    void testSetBalanceRealTime() {
        // Mock repository responses
        when(partnerProductRepository.findBankDepositProducts()).thenReturn(bankDepositProducts);
        when(productRepository.findAllExceptSpecificIds(any())).thenReturn(products);
        when(transactionRepository.findLastTransactionDate(any())).thenReturn(lastTransactionDate);
        when(partnerXRepository.findPaidTransactionsBetween(any(), any(), any()))
            .thenReturn(Arrays.asList(samplePartnerX));
        when(productRepository.findById(anyInt())).thenReturn(Optional.of(sampleProduct));
        when(notificationRepository.findRateForDate(anyInt(), any()))
            .thenReturn(Optional.of(new BigDecimal("12")));
        when(transactionRepository.calculateTransactionSum(any(), anyInt()))
            .thenReturn(new BigDecimal("1000"));
        when(commissionRepository.findTauxCommission(anyInt()))
            .thenReturn(Optional.of(sampleCommission));
        when(transactionRepository.findLastTransactionId(any(), anyInt()))
            .thenReturn(1);

        // Execute the scheduler
        balanceRealTimeScheduler.setBalanceRealTime();

        // Verify repository interactions
        verify(partnerProductRepository).findBankDepositProducts();
        verify(productRepository).findAllExceptSpecificIds(bankDepositProducts);
        verify(transactionRepository).findLastTransactionDate(bankDepositProducts);
        verify(partnerXRepository).findPaidTransactionsBetween(any(), any(), any());
        verify(transactionRepository, atLeastOnce()).save(any(TresoTransactions.class));
        verify(currentBalanceRepository, atLeastOnce()).updateCurrentBalance(anyInt(), any(BigDecimal.class), anyInt());
    }

    @Test
    void testSetBalanceRealTimeWithNoTransactions() {
        // Mock repository responses for no transactions scenario
        when(partnerProductRepository.findBankDepositProducts()).thenReturn(bankDepositProducts);
        when(productRepository.findAllExceptSpecificIds(any())).thenReturn(products);
        when(transactionRepository.findLastTransactionDate(any())).thenReturn(lastTransactionDate);
        when(partnerXRepository.findPaidTransactionsBetween(any(), any(), any()))
            .thenReturn(Arrays.asList());
        when(transactionRepository.calculateTransactionSum(any(), anyInt()))
            .thenReturn(BigDecimal.ZERO);

        // Execute the scheduler
        balanceRealTimeScheduler.setBalanceRealTime();

        // Verify repository interactions
        verify(partnerProductRepository).findBankDepositProducts();
        verify(productRepository).findAllExceptSpecificIds(bankDepositProducts);
        verify(transactionRepository).findLastTransactionDate(bankDepositProducts);
        verify(partnerXRepository).findPaidTransactionsBetween(any(), any(), any());
        verify(transactionRepository, never()).save(any(TresoTransactions.class));
        verify(currentBalanceRepository, never()).updateCurrentBalance(anyInt(), any(BigDecimal.class), anyInt());
    }

    @Test
    void testSetBalanceRealTimeWithTransactionDelay() {
        // Mock repository responses with old last transaction date
        LocalDateTime oldTransactionDate = LocalDateTime.now().minusHours(5);
        when(partnerProductRepository.findBankDepositProducts()).thenReturn(bankDepositProducts);
        when(productRepository.findAllExceptSpecificIds(any())).thenReturn(products);
        when(transactionRepository.findLastTransactionDate(any())).thenReturn(oldTransactionDate);
        when(partnerXRepository.findPaidTransactionsBetween(any(), any(), any()))
            .thenReturn(Arrays.asList());

        // Execute the scheduler
        balanceRealTimeScheduler.setBalanceRealTime();

        // Verify repository interactions
        verify(partnerProductRepository).findBankDepositProducts();
        verify(productRepository).findAllExceptSpecificIds(bankDepositProducts);
        verify(transactionRepository).findLastTransactionDate(bankDepositProducts);
        verify(partnerXRepository).findPaidTransactionsBetween(any(), any(), any());
        // Add verification for delay notification if implemented
    }
} 