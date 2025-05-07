package com.mtoManage.CP_mtoLedger.services.impl;

import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TresoFxRateNotificationService {

    private final TresoProductRepository tresoProductRepository;
    private final JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${treso.notification.team.email}")
    private String tresoTeamEmail;

    @Value("${treso.notification.team.cc}")
    private String tresoTeamCc;

    @Scheduled(fixedRate = 30 * 60 * 1000) // Runs every 30 minutes
    @Transactional
    public void sendFxRateNotifications() {
        log.info("Starting FX rate notification task at {}", LocalDateTime.now());
        
        // Check if notifications are enabled for today
        if (!isNotificationEnabledForToday()) {
            log.info("Notifications are disabled for today");
            return;
        }

        List<TresoProduct> products = tresoProductRepository.findAll();
        
        for (TresoProduct product : products) {
            try {
                processProductNotification(product);
            } catch (Exception e) {
                log.error("Error processing notification for product {}: {}", product.getProductId(), e.getMessage());
            }
        }
    }

    private boolean isNotificationEnabledForToday() {
        // TODO: Implement check from TresoActivationNotif table
        return true;
    }

    private void processProductNotification(TresoProduct product) throws MessagingException {
        LocalTime currentTime = LocalTime.now();
        LocalTime notificationTime = product.getDateNotif().toLocalTime();

        if (currentTime.isBefore(notificationTime)) {
            log.debug("Not yet time to send notification for product {}", product.getProductId());
            return;
        }

        // Check if notification was already sent today
        if (wasNotificationSentToday(product)) {
            log.debug("Notification already sent today for product {}", product.getProductId());
            return;
        }

        String notificationType = product.getNotificationMethod();
        if (notificationType == null || notificationType.equals("Aucune")) {
            return;
        }

        BigDecimal rate = calculateRate(product);
        
        switch (notificationType.toUpperCase()) {
            case "EMAIL":
                sendEmailNotification(product, rate);
                break;
            case "SFTP":
                sendSftpNotification(product, rate);
                break;
            default:
                log.warn("Unknown notification type: {} for product {}", notificationType, product.getProductId());
        }
    }

    private boolean wasNotificationSentToday(TresoProduct product) {
        // TODO: Implement check from TresoNotifications table
        return false;
    }

    private BigDecimal calculateRate(TresoProduct product) {
        // TODO: Implement rate calculation based on BKAM rates and product's decote
        return BigDecimal.ZERO;
    }

    private void sendEmailNotification(TresoProduct product, BigDecimal rate) throws MessagingException {
        if (product.getEmail() == null || product.getEmail().isEmpty()) {
            log.warn("No email configured for product {}", product.getProductId());
            return;
        }

        String emailBody = createEmailBody(rate);
        
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(product.getEmail().split(","));
        helper.setCc(tresoTeamCc.split(","));
        helper.setSubject("Cash Plus - Exchange Rates");
        helper.setText(emailBody, true);
        
        emailSender.send(message);
        
        // TODO: Record notification in TresoNotifications table
        log.info("Email notification sent for product {}", product.getProductId());
    }

    private void sendSftpNotification(TresoProduct product, BigDecimal rate) {
        // TODO: Implement SFTP file generation and transfer
        log.info("SFTP notification processing for product {}", product.getProductId());
    }

    private String createEmailBody(BigDecimal rate) {
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
        String formattedDate = tomorrow.format(DateTimeFormatter.ofPattern("dd/MM/yyyy 00:00:00 GMT"));
        
        return String.format("""
            <html>
            <head></head>
            <body>
            <b>Hello,<br/><br/>
            Please find below the rate to apply:</b><br/><br/>
            <style>
                table { width: 70%%; }
                table, td {
                    border: 1px groove black;
                    text-align: center;
                    vertical-align: middle;
                }
            </style>
            <table>
                <tr>
                    <td>Date de valeur</td>
                    <td>Cours de cession</td>
                </tr>
                <tr>
                    <td>%s</td>
                    <td>%s</td>
                </tr>
            </table><br/>
            This exchange rate is to be applied until we send you an updated rate<br/><br/>
            <b>Best regards</b>
            </body>
            </html>
            """, formattedDate, rate.toString());
    }
} 