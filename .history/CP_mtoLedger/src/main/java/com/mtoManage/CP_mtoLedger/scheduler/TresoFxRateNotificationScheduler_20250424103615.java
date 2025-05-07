package com.mtoManage.CP_mtoLedger.scheduler;

import com.mtoManage.CP_mtoLedger.models.TresoActivationNotif;
import com.mtoManage.CP_mtoLedger.models.TresoBkam;
import com.mtoManage.CP_mtoLedger.models.TresoNotifications;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.TresoActivationNotifRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoBkamRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoNotificationsRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

@Slf4j
@Component
public class TresoFxRateNotificationScheduler {

    private final TresoProductRepository tresoProductRepository;
    private final TresoActivationNotifRepository activationNotifRepository;
    private final TresoNotificationsRepository notificationsRepository;
    private final TresoBkamRepository bkamRepository;
    private final JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${treso.notification.team.email}")
    private String tresoTeamEmail;

    @Value("${treso.notification.team.cc}")
    private String tresoTeamCc;

    @Autowired
    public TresoFxRateNotificationScheduler(
            TresoProductRepository tresoProductRepository,
            TresoActivationNotifRepository activationNotifRepository,
            TresoNotificationsRepository notificationsRepository,
            TresoBkamRepository bkamRepository,
            JavaMailSender emailSender) {
        this.tresoProductRepository = tresoProductRepository;
        this.activationNotifRepository = activationNotifRepository;
        this.notificationsRepository = notificationsRepository;
        this.bkamRepository = bkamRepository;
        this.emailSender = emailSender;
    }

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
        Optional<TresoActivationNotif> activation = activationNotifRepository.findByDate(LocalDate.now());
        return activation.map(TresoActivationNotif::getState).orElse(false);
    }

    private void processProductNotification(TresoProduct product) throws MessagingException {
        LocalTime currentTime = LocalTime.now();
        LocalTime notificationTime = product.getDateNotif();

        if (currentTime.isBefore(notificationTime)) {
            log.debug("Not yet time to send notification for product {}", product.getProductId());
            return;
        }

        if (wasNotificationSentToday(product)) {
            log.debug("Notification already sent today for product {}", product.getProductId());
            return;
        }

        String notificationType = product.getNotif();
        if (notificationType == null || notificationType.equals("Aucune")) {
            return;
        }

        BigDecimal rate = calculateRate(product);
        if (rate == null) {
            log.error("Could not calculate rate for product {}", product.getProductId());
            return;
        }
        
        boolean success = false;
        switch (notificationType.toUpperCase()) {
            case "EMAIL":
                sendEmailNotification(product, rate);
                success = true;
                break;
            case "SFTP":
                success = sendSftpNotification(product, rate);
                break;
            default:
                log.warn("Unknown notification type: {} for product {}", notificationType, product.getProductId());
                return;
        }

        if (success) {
            recordNotification(product, rate);
        }
    }

    private boolean wasNotificationSentToday(TresoProduct product) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        List<TresoNotifications> notifications = notificationsRepository.findByProductIdAndDateAfter(
            product.getProductId(), 
            startOfDay
        );
        return !notifications.isEmpty();
    }

    private BigDecimal calculateRate(TresoProduct product) {
        String devise = product.getProductDeviseFx();
        if (devise == null) {
            log.error("No devise configured for product {}", product.getProductId());
            return null;
        }

        Optional<TresoBkam> bkamRate = bkamRepository.findLatestByDevise(devise);
        if (bkamRate.isEmpty()) {
            log.error("No BKAM rate found for devise {} for product {}", devise, product.getProductId());
            return null;
        }

        BigDecimal decote = product.getDecote();
        if (decote == null) {
            log.error("No decote configured for product {}", product.getProductId());
            return null;
        }

        BigDecimal rate = bkamRate.get().getCoursVirement();
        BigDecimal calculatedRate = rate.multiply(BigDecimal.ONE.subtract(decote))
            .setScale(2, RoundingMode.HALF_UP);

        log.info("Calculated rate {} for product {} (BKAM rate: {}, decote: {})", 
            calculatedRate, product.getProductId(), rate, decote);

        return calculatedRate;
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
        log.info("Email notification sent for product {}", product.getProductId());
    }

    private boolean sendSftpNotification(TresoProduct product, BigDecimal rate) {
        try {
            String filename = generateXmlFilename(product);
            String xmlContent = generateXmlContent(product, rate);
            
            // Create local directory if it doesn't exist
            Path localDir = Paths.get(product.getLocalDirectoryName());
            Files.createDirectories(localDir);
            
            // Write XML file
            Path xmlFile = localDir.resolve(filename);
            Files.writeString(xmlFile, xmlContent);
            
            // TODO: Implement SFTP transfer
            // For now, just log success
            log.info("XML file generated for product {}: {}", product.getProductId(), xmlFile);
            return true;
            
        } catch (Exception e) {
            log.error("Error generating XML file for product {}: {}", product.getProductId(), e.getMessage());
            return false;
        }
    }

    private String generateXmlFilename(TresoProduct product) {
        String prefix = product.getFileNamePrefix();
        String suffix = product.getFileNameSuffix();
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        return String.format("%s%s%s.xml", prefix, date, suffix);
    }

    private String generateXmlContent(TresoProduct product, BigDecimal rate) 
            throws ParserConfigurationException, TransformerException {
        DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

        // Create document
        Document doc = docBuilder.newDocument();
        Element rootElement = doc.createElement("fxs");
        doc.appendChild(rootElement);

        // Add attributes
        rootElement.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
        rootElement.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
        rootElement.setAttribute("schemaVersion", "0");

        // Create fx element
        Element fxElement = doc.createElement("fx");
        rootElement.appendChild(fxElement);

        // Add child elements
        addElement(doc, fxElement, "from", product.getProductDeviseFx());
        addElement(doc, fxElement, "to", "MAD");
        addElement(doc, fxElement, "exchangeRate", rate.toString());
        addElement(doc, fxElement, "generationTime", 
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:00:00-0000")));
        addElement(doc, fxElement, "applyTime", 
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'17:00:00-0000")));

        // Convert to string
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        DOMSource source = new DOMSource(doc);
        
        java.io.StringWriter writer = new java.io.StringWriter();
        StreamResult result = new StreamResult(writer);
        transformer.transform(source, result);
        
        return writer.toString();
    }

    private void addElement(Document doc, Element parent, String name, String value) {
        Element element = doc.createElement(name);
        element.setTextContent(value);
        parent.appendChild(element);
    }

    private void recordNotification(TresoProduct product, BigDecimal rate) {
        TresoNotifications notification = TresoNotifications.builder()
            .date(LocalDateTime.now())
            .productId(product.getProductId())
            .rate(rate)
            .type("FxRate")
            .method(product.getNotif())
            .received(1)
            .decote(product.getDecote())
            .libDecote(product.getLibDecote())
            .dateNotif(LocalTime.now())
            .productDeviseFx(product.getProductDeviseFx())
            .source("BKAM")
            .applyDate(LocalDate.now().atTime(16, 0))
            .nextApplyDate(LocalDateTime.of(2900, 1, 1, 0, 0))
            .build();

        notificationsRepository.save(notification);
        log.info("Recorded notification for product {}", product.getProductId());
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