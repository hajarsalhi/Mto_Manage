package com.mtoManage.CP_mtoLedger.config;

import com.mtoManage.CP_mtoLedger.models.*;
import com.mtoManage.CP_mtoLedger.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TresoProductRepository tresoProductRepository;
    
    @Autowired
    private TresoBalanceRepository tresoBalanceRepository;
    
    @Autowired
    private TresoCompensationRepository tresoCompensationRepository;
    
    @Autowired
    private TresoTransactionsRepository tresoTransactionsRepository;
    
    @Autowired
    private TresoNotificationsRepository tresoNotificationsRepository;
    
    @Autowired
    private TresoRiskValueRepository tresoRiskValueRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TresoCommissionRepository tresoCommissiontionRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only load data if the database is empty
        if (userRepository.count() == 0) {
            loadUsers();
        }
        
        if (tresoProductRepository.count() == 0) {
            loadProducts();
        }
        
        if (tresoCompensationRepository.count() == 0) {
            loadCompensations();
        }
        
        if (tresoTransactionsRepository.count() == 0) {
            loadTransactions();
        }
        
        if (tresoNotificationsRepository.count() == 0) {
            loadNotifications();
        }
        
        if (tresoRiskValueRepository.count() == 0) {
            loadRiskValues();
        }
    }
    
    private void loadUsers() {
        System.out.println("Loading users...");
        
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .email("admin@example.com")
                .firstName("Admin")
                .lastName("User")
                .role(UserRole.ADMIN)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        User operator = User.builder()
                .username("operator")
                .password(passwordEncoder.encode("operator123"))
                .email("operator@example.com")
                .firstName("Operator")
                .lastName("User")
                .role(UserRole.OPERATOR)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        User viewer = User.builder()
                .username("viewer")
                .password(passwordEncoder.encode("viewer123"))
                .email("viewer@example.com")
                .firstName("Regular")
                .lastName("User")
                .role(UserRole.VIEWER)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        userRepository.saveAll(Arrays.asList(admin, operator, viewer));
        System.out.println("Users loaded successfully!");
    }
    
    private void loadProducts() {
        System.out.println("Loading products...");
        
        // Create MTO products
        TresoProduct westernUnion = new TresoProduct();
        westernUnion.setProductId(1);
        westernUnion.setProductName("Western Union");
        westernUnion.setActive(1);
        
        TresoProduct moneyGram = new TresoProduct();
        moneyGram.setProductId(2);
        moneyGram.setProductName("MoneyGram");
        moneyGram.setActive(1);
        
        TresoProduct ria = new TresoProduct();
        ria.setProductId(3);
        ria.setProductName("Ria");
        ria.setActive(1);
        
        tresoProductRepository.saveAll(Arrays.asList(westernUnion, moneyGram, ria));

        TresoCommission commissionMoneyGram = new TresoCommission();
        commissionMoneyGram.setCommission(new BigDecimal("1.2"));
        commissionMoneyGram.setProduct(moneyGram);
        commissionMoneyGram.setDate(LocalDate.now());
        commissionMoneyGram.setProductId(moneyGram.getProductId());

        TresoCommission commissionRia = new TresoCommission();
        commissionRia.setCommission(new BigDecimal("0.9"));
        commissionRia.setProduct(ria);
        commissionRia.setDate(LocalDate.now());
        commissionRia.setProductId(ria.getProductId());


        TresoCommission commissionWesternUnion = new TresoCommission();
        commissionWesternUnion.setCommission(new BigDecimal("1.3"));
        commissionWesternUnion.setProduct(westernUnion);
        commissionWesternUnion.setDate(LocalDate.now());
        commissionWesternUnion.setProductId(westernUnion.getProductId());

        tresoCommissiontionRepository.saveAll(Arrays.asList(commissionMoneyGram,commissionRia,commissionWesternUnion));

        System.out.println("Products loaded successfully!");

        TresoBalance wuBalance = new TresoBalance();
        wuBalance.setBalance(new BigDecimal("125000.50"));
        wuBalance.setDateUpdate(LocalDateTime.now());
        wuBalance.setId(new TresoBalanceId(LocalDate.now(),westernUnion.getProductId()));
        wuBalance.setCompensationJ1(new BigDecimal("5000.00"));
        wuBalance.setProductName(westernUnion.getProductName());


        TresoBalance mgBalance = new TresoBalance();
        mgBalance.setBalance(new BigDecimal("85000.25"));
        mgBalance.setDateUpdate(LocalDateTime.now());
        mgBalance.setId(new TresoBalanceId(LocalDate.now(), moneyGram.getProductId()));
        mgBalance.setCompensationJ1(new BigDecimal("3000.00"));
        mgBalance.setProductName(moneyGram.getProductName());

        TresoBalance rBalance = new TresoBalance();
        rBalance.setBalance(new BigDecimal("45000.73"));
        rBalance.setDateUpdate(LocalDateTime.now());
        rBalance.setId(new TresoBalanceId(LocalDate.now(), ria.getProductId()));
        rBalance.setCompensationJ1(new BigDecimal("2000.00"));
        rBalance.setProductName(ria.getProductName());

        
        tresoBalanceRepository.saveAll(Arrays.asList(wuBalance, mgBalance, rBalance));
        
        System.out.println("Balances loaded successfully!");
    }
    
    private void loadCompensations() {
        System.out.println("Loading compensations...");
        
        // Create compensations for Western Union
        TresoCompensation wuComp1 = new TresoCompensation();
        wuComp1.setProductId(1);
        wuComp1.setProductName("Western Union");
        wuComp1.setDate(LocalDate.now().minusDays(1));
        wuComp1.setCompensation(new BigDecimal("5000.00"));
        wuComp1.setCompTheorique(new BigDecimal("5050.00"));
        wuComp1.setTaux(new BigDecimal("1.05"));
        wuComp1.setCompCommission(new BigDecimal("250.00"));
        wuComp1.setInsertion(LocalDateTime.now());
        wuComp1.setFileName("WU_COMP_20230615.csv");
        
        TresoCompensation wuComp2 = new TresoCompensation();
        wuComp2.setProductId(1);
        wuComp2.setProductName("Western Union");
        wuComp2.setDate(LocalDate.now().minusDays(2));
        wuComp2.setCompensation(new BigDecimal("4500.00"));
        wuComp2.setCompTheorique(new BigDecimal("4545.00"));
        wuComp2.setTaux(new BigDecimal("1.05"));
        wuComp2.setCompCommission(new BigDecimal("225.00"));
        wuComp2.setInsertion(LocalDateTime.now());
        wuComp2.setFileName("WU_COMP_20230614.csv");
        
        // Create compensations for MoneyGram
        TresoCompensation mgComp1 = new TresoCompensation();
        mgComp1.setProductId(2);
        mgComp1.setProductName("MoneyGram");
        mgComp1.setDate(LocalDate.now().minusDays(1));
        mgComp1.setCompensation(new BigDecimal("3000.00"));
        mgComp1.setCompTheorique(new BigDecimal("3030.00"));
        mgComp1.setTaux(new BigDecimal("1.02"));
        mgComp1.setCompCommission(new BigDecimal("150.00"));
        mgComp1.setInsertion(LocalDateTime.now());
        mgComp1.setFileName("MG_COMP_20230615.csv");
        
        // Create compensations for Ria
        TresoCompensation riaComp1 = new TresoCompensation();
        riaComp1.setProductId(3);
        riaComp1.setProductName("Ria");
        riaComp1.setDate(LocalDate.now().minusDays(1));
        riaComp1.setCompensation(new BigDecimal("2000.50"));
        riaComp1.setCompTheorique(new BigDecimal("2020.50"));
        riaComp1.setTaux(new BigDecimal("1.03"));
        riaComp1.setCompCommission(new BigDecimal("100.00"));
        riaComp1.setInsertion(LocalDateTime.now());
        riaComp1.setFileName("RIA_COMP_20230615.csv");
        
        tresoCompensationRepository.saveAll(Arrays.asList(wuComp1, wuComp2, mgComp1, riaComp1));
        
        System.out.println("Compensations loaded successfully!");
    }
    
    private void loadTransactions() {
        System.out.println("Loading transactions...");
        
        // Create transactions for Western Union
        TresoTransactions wuTx1 = new TresoTransactions();
        wuTx1.setProductId(1);
        wuTx1.setDate(LocalDateTime.now().minusDays(1));
        wuTx1.setAmount(new BigDecimal("10000.25"));
        wuTx1.setDescription("Daily transactions WU");
        wuTx1.setType("DEBIT");
        wuTx1.setReference("WU-TX-001");
        
        // Create transactions for MoneyGram
        TresoTransactions mgTx1 = new TresoTransactions();
        mgTx1.setProductId(2);
        mgTx1.setDate(LocalDateTime.now().minusDays(1));
        mgTx1.setAmount(new BigDecimal("6000.75"));
        mgTx1.setDescription("Daily transactions MG");
        mgTx1.setType("DEBIT");
        mgTx1.setReference("MG-TX-001");
        
        // Create transactions for Ria
        TresoTransactions riaTx1 = new TresoTransactions();
        riaTx1.setProductId(3);
        riaTx1.setDate(LocalDateTime.now().minusDays(1));
        riaTx1.setAmount(new BigDecimal("4000.00"));
        riaTx1.setDescription("Daily transactions RIA");
        riaTx1.setType("DEBIT");
        riaTx1.setReference("RIA-TX-001");
        
        tresoTransactionsRepository.saveAll(Arrays.asList(wuTx1, mgTx1, riaTx1));
        
        System.out.println("Transactions loaded successfully!");
    }
    
    private void loadNotifications() {
        System.out.println("Loading notifications...");
        
        // Create FX rate notifications
        TresoNotifications wuNotif = new TresoNotifications();
        wuNotif.setProductId(1);
        wuNotif.setDate(LocalDateTime.now().minusDays(1));
        wuNotif.setRate(new BigDecimal("10.5"));
        wuNotif.setType("FX_RATE");
        wuNotif.setMethod("Email");
        wuNotif.setReceived(1);
        wuNotif.setUpdatedBy("system");
        wuNotif.setDecote(new BigDecimal("0.05"));
        wuNotif.setLibDecote("Standard discount");
        wuNotif.setDateNotif(LocalTime.of(9, 0));
        wuNotif.setProductDeviseFx("USD");
        wuNotif.setSource("API");
        wuNotif.setApplyDate(LocalDateTime.now());
        
        TresoNotifications mgNotif = new TresoNotifications();
        mgNotif.setProductId(2);
        mgNotif.setDate(LocalDateTime.now().minusDays(1));
        mgNotif.setRate(new BigDecimal("11.2"));
        mgNotif.setType("FX_RATE");
        mgNotif.setMethod("SFTP");
        mgNotif.setReceived(1);
        mgNotif.setUpdatedBy("system");
        mgNotif.setDecote(new BigDecimal("0.03"));
        mgNotif.setLibDecote("Standard discount");
        mgNotif.setDateNotif(LocalTime.of(9, 30));
        mgNotif.setProductDeviseFx("EUR");
        mgNotif.setSource("API");
        mgNotif.setApplyDate(LocalDateTime.now());
        
        tresoNotificationsRepository.saveAll(Arrays.asList(wuNotif, mgNotif));
        
        System.out.println("Notifications loaded successfully!");
    }
    
    private void loadRiskValues() {
        System.out.println("Loading risk values...");
        
        // Create risk values for each MTO
        TresoRiskValue wuRisk = new TresoRiskValue();
        wuRisk.setProductId(1);
        wuRisk.setRiskValue(new BigDecimal("500000"));
        wuRisk.setDateStart(LocalDateTime.now().minusMonths(1));
        wuRisk.setDateEnd(LocalDateTime.of(2025,03,21,5,6,8)); // No end date means it's currently active
        
        TresoRiskValue mgRisk = new TresoRiskValue();
        mgRisk.setProductId(2);
        mgRisk.setRiskValue(new BigDecimal("300000"));
        mgRisk.setDateStart(LocalDateTime.now().minusMonths(1));
        mgRisk.setDateEnd(LocalDateTime.of(2025,03,22,14,65,0)); // No end date means it's currently active
        
        TresoRiskValue riaRisk = new TresoRiskValue();
        riaRisk.setProductId(3);
        riaRisk.setRiskValue(new BigDecimal("200000"));
        riaRisk.setDateStart(LocalDateTime.now().minusMonths(1));
        riaRisk.setDateEnd(LocalDateTime.of(2025,03,23,12,20,0 )); // No end date means it's currently active
        
        tresoRiskValueRepository.saveAll(Arrays.asList(wuRisk, mgRisk, riaRisk));
        
        System.out.println("Risk values loaded successfully!");
    }
} 