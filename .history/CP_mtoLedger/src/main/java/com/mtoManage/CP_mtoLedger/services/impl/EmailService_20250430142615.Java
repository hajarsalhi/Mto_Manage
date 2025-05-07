package com.mtoManage.CP_mtoLedger.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.config.ConfigParams;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.services.ReconciliationReportService;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;

import com.mtoManage.CP_mtoLedger.repositories.TresoSchedulerRepository;

@Service
public class EmailService {

    private static final String HEADER_COLUMN = "Date,Product,Transaction,FX Rate,Currency";
    
    //private AmazonS3 amazonS3;
    
    @Autowired
    private ConfigParams configParams;
    
    @Autowired
    private TresoSchedulerRepository schedulerRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JavaMailSender emailSender;

    
    
    @Autowired
    private ReconciliationReportService reconciliationReportService;


    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${treso.notification.team.email}")
    private String tresoTeamEmail;

    @Value("${treso.notification.team.cc}")
    private String tresoTeamCc;
    
    public void sendEmailWithAttachment(String to, String cc, String subject, String body, String bucketName, String s3FilePath, String fileName) {
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
}