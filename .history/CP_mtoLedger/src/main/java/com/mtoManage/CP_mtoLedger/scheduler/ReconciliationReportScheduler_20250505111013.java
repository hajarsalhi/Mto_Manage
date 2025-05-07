
package com.mtoManage.CP_mtoLedger.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mtoManage.CP_mtoLedger.config.ConfigParams;
import com.mtoManage.CP_mtoLedger.models.TresoNotifications;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.models.TresoScheduler;
import com.mtoManage.CP_mtoLedger.services.ReconciliationReportService;
import com.mtoManage.CP_mtoLedger.services.impl.NotificationService;
import com.mtoManage.CP_mtoLedger.services.impl.SchedulerService;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReconciliationReportScheduler {

    private final ReconciliationReportService reconciliationReportService;
    private final SchedulerService schedulerService;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 11 11 * * *") // Runs at 1 AM every day
    public void generateReconciliationReports() {
        log.info("Starting reconciliation report generation at {}", LocalDateTime.now());
        
        try {
            List<TresoProduct> products = reconciliationReportService.getActiveProductsForReconciliation();
            
            for (TresoProduct product : products) {
                try {
                    // Check if previous day's balance realization exists
                    if (!reconciliationReportService.checkSchedulerState("setBalanceRealisations", 1)) {
                        schedulerService.notifySchedulerError(
                            LocalDateTime.now(),
                            "mto_recon_report_generator_" + product.getProductName(),
                            "Chronologique",
                            "setBalanceRealisations Yesterday Non Existent",
                            "",
                            0
                        );
                        continue;
                    }

                    // Check if today's balance realization exists
                    if (!reconciliationReportService.checkSchedulerState("setBalanceRealisations", 0)) {
                        schedulerService.notifySchedulerError(
                            LocalDateTime.now(),
                            "mto_recon_report_generator_" + product.getProductName(),
                            "Chronologique",
                            "setBalanceRealisations Today Non Existent",
                            "",
                            0
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

                    // Update scheduler state
                    TresoScheduler scheduler = new TresoScheduler();
                    scheduler.setSchedulerName("mto_recon_report_generator_" + product.getProductName());
                    scheduler.setDate(LocalDateTime.now());
                    scheduler.setState(1);

                } catch (Exception e) {
                    log.error("Error processing product {}: {}", product.getProductId(), e.getMessage(), e);
                    schedulerService.notifySchedulerError(
                        LocalDateTime.now(),
                        "mto_recon_report_generator",
                        e.getClass().getSimpleName(),
                        e.getMessage(),
                        e.toString(),
                        0
                    );
                }
            }
        } catch (Exception e) {
            log.error("Critical error in reconciliation report scheduler: {}", e.getMessage(), e);
            schedulerService.notifySchedulerError(
                LocalDateTime.now(),
                "mto_recon_report_generator",
                "CRITICAL",
                e.getMessage(),
                e.toString(),
                0
            );
        }
    }
}
