


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReconciliationReportScheduler {

    private final ReconciliationReportService reconciliationReportService;
    private final NotificationService notificationService;
    private final ConfigParams configParams;

    @Scheduled(cron = "0 0 1 * * *") // Runs at 1 AM every day
    public void generateReconciliationReports() {
        log.info("Starting reconciliation report generation at {}", LocalDateTime.now());
        
        try {
            List<Product> products = reconciliationReportService.getActiveProductsForReconciliation();
            
            for (Product product : products) {
                try {
                    // Check if previous day's balance realization exists
                    if (!reconciliationReportService.checkSchedulerState("setBalanceRealisations", 1)) {
                        notificationService.notifySchedulerError(
                            LocalDateTime.now(),
                            "mto_recon_report_generator_" + product.getProductName(),
                            "Chronologique",
                            "setBalanceRealisations Yesterday Non Existent",
                            ""
                        );
                        continue;
                    }

                    // Check if today's balance realization exists
                    if (!reconciliationReportService.checkSchedulerState("setBalanceRealisations", 0)) {
                        notificationService.notifySchedulerError(
                            LocalDateTime.now(),
                            "mto_recon_report_generator_" + product.getProductName(),
                            "Chronologique",
                            "setBalanceRealisations Today Non Existent",
                            ""
                        );
                        return;
                    }

                    // Generate and send report
                    reconciliationReportService.generateAndSendReport(product);
                    
                    // Notify success
                    notificationService.notifyMessage(
                        LocalDateTime.now(),
                        "mto_recon_report_generator_" + product.getProductName()
                    );

                } catch (Exception e) {
                    log.error("Error processing product {}: {}", product.getProductId(), e.getMessage(), e);
                    notificationService.notifySchedulerError(
                        LocalDateTime.now(),
                        "mto_recon_report_generator",
                        e.getClass().getSimpleName(),
                        e.getMessage(),
                        e.toString()
                    );
                }
            }
        } catch (Exception e) {
            log.error("Critical error in reconciliation report scheduler: {}", e.getMessage(), e);
            notificationService.notifySchedulerError(
                LocalDateTime.now(),
                "mto_recon_report_generator",
                "CRITICAL",
                e.getMessage(),
                e.toString()
            );
        }
    }
}
