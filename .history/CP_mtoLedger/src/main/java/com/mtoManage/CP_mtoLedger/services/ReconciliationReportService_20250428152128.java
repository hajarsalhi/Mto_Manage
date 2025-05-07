package com.mtoManage.CP_mtoLedger.services;
import com.mtoManage.CP_mtoLedger.config.ConfigParams;
import com.mtoManage.CP_mtoLedger.models.Product;
import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoCompensation;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.*;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Arrays;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReconciliationReportService {

    private final TresoProductRepository tresoProductRepository;
    private final TransactionRepository transactionRepository;
    private final TresoBalanceRepository balanceRepository;
    private final CompensationRepository compensationRepository;
    private final TresoSchedulerRepository schedulerRepository;
    private final JavaMailSender emailSender;
    private final ConfigParams configParams;
    //private final AmazonS3 amazonS3;

    private static final List<Integer> PRODUCT_BALANCE_MAD = Arrays.asList(5060);
    private static final String HEADER_COLUMN = "Date,Type,Transaction Id,Internal Code,Settlement Currency,Settlement Amount,Commission,Fx rate,Disbursement Currency,Disbursement Amount (MAD),Account Balance";

    public List<TresoProduct> getActiveProductsForReconciliation() {
        return tresoProductRepository.findActiveProductsForReconciliation();
    }

    public boolean checkSchedulerState(String schedulerName, int daysAgo) {
        LocalDate checkDate = LocalDate.now().minusDays(daysAgo);
        return schedulerRepository.existsByDateAndNameAndState(checkDate,schedulerName, 1);
    }

    public void generateAndSendReport(TresoProduct product) throws IOException {
        String fileShortName = String.format("Cashplus_%d_%s.csv", 
            product.getProductId(), 
            LocalDate.now().minusDays(1).format(DateTimeFormatter.BASIC_ISO_DATE));
        
        Path reportDir = Paths.get("cashplus_files/cp_data/recon_mto/recon_reports_" + product.getProductId());
        Files.createDirectories(reportDir);
        
        Path filePath = reportDir.resolve(fileShortName);
        String s3FilePath = "recon_mto/recon_reports_" + product.getProductId() + "/" + fileShortName;

        try (BufferedWriter writer = Files.newBufferedWriter(filePath)) {
            // Write header
            writer.write(HEADER_COLUMN);
            writer.newLine();

            LocalDate reportDate = LocalDate.now().minusDays(1);
            BigDecimal accountBalance = writeReportContent(writer, product, reportDate);


            /*
            // Upload to S3
            amazonS3.putObject(new PutObjectRequest(
                configParams.getAwsBucketName(),
                s3FilePath,
                filePath.toFile()
            ));*/

            // Send email
            String emailBody = String.format(
                "Hello,<br>Please find attached the reconciliation file for %s:<br><br>Best regards",
                reportDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            );
            /* 
            emailService.sendEmailWithAttachment(
                product.,
                configParams.getMailCcTeam(),
                "Reconciliation reports",
                emailBody,
                configParams.getAwsBucketName(),
                s3FilePath,
                fileShortName
            );*/

        } catch (IOException e) {
            log.error("Error generating report for product {}: {}", product.getProductId(), e.getMessage());
            throw e;
        }
    }

    private BigDecimal writeReportContent(BufferedWriter writer, TresoProduct product, LocalDate reportDate) throws IOException {
        // Get starting balance
        TresoBalance startBalance = balanceRepository.findByProductAndDate(product.getProductId(), reportDate)
        .orElse(null);

        if(startBalance == null) {
            log.error("No starting balance found for product {} on date {}", product.getProductId(), reportDate);
            return BigDecimal.ZERO;
        }
        BigDecimal accountBalance = startBalance.getComputedBalance();
        String devise = PRODUCT_BALANCE_MAD.contains(product.getProductId()) ? "MAD" : product.getProductDeviseFx();

        // Write starting balance
        writer.write(String.format("%s,Beginning Balance,,,%s,,,,,,%.2f",
            reportDate.format(DateTimeFormatter.ofPattern("MM-dd-yyyy")),
            devise,
            accountBalance
        ));
        writer.newLine();

        // Write compensations
        List<TresoCompensation> compensations = compensationRepository.findByProductAndDate(
            product.getProductId(), reportDate);
        for (TresoCompensation comp : compensations) {
            accountBalance = accountBalance.add(comp.getTotalCompensation());
            writer.write(String.format("%s,Funding,,,%s,%.2f,,,,,%.2f",
                comp.getDate().format(DateTimeFormatter.ofPattern("MM-dd-yyyy")),
                devise,
                comp.getTotalCompensation(),
                accountBalance
            ));
            writer.newLine();
        }

        // Write transactions
        List<Transaction> transactions = transactionRepository.findByProductAndDate(
            product.getProductId(), reportDate);
        for (Transaction trx : transactions) {
            BigDecimal commission = trx.getSendAmount()
                .multiply(BigDecimal.valueOf(trx.getCommissionRate()))
                .divide(BigDecimal.valueOf(100));
            
            accountBalance = accountBalance.subtract(trx.getSendAmount()).subtract(commission);
            
            writer.write(String.format("%s,Disbursement,%s,%s,%s,%.2f,%.2f,%.4f,%s,%.2f,%.2f",
                trx.getDate().format(DateTimeFormatter.ofPattern("MM-dd-yyyy")),
                trx.getTransactionCode(),
                trx.getInternalCode(),
                trx.getSendCurrency(),
                trx.getSendAmount(),
                commission,
                trx.getFxRate(),
                "MAD",
                trx.getAmountMAD(),
                accountBalance
            ));
            writer.newLine();
        }

        // Write ending balance
        Balance endBalance = balanceRepository.findByProductAndDate(
            product.getProductId(), reportDate.plusDays(1))
            .orElse(new Balance(accountBalance));
            
        writer.write(String.format("%s,Ending Balance,,,%s,,,,,,%.2f",
            reportDate.format(DateTimeFormatter.ofPattern("MM-dd-yyyy")),
            devise,
            endBalance.getComputedBalance()
        ));
        writer.newLine();

        return accountBalance;
    }
}
