package com.mtoManage.CP_mtoLedger.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;


@Service
public class EmailService {
    

    @Autowired
    private JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${treso.notification.team.email}")
    private String tresoTeamEmail;

    @Value("${treso.notification.team.cc}")
    private String tresoTeamCc;
    
    public void sendEmailWithAttachment(String to[], String subject, String body, Path attachmentPath) throws MessagingException{
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setCc(tresoTeamCc.split(","));
        helper.setSubject(subject);
        helper.setText(body, true);
        
        // Add attachment
        FileSystemResource file = new FileSystemResource(attachmentPath.toFile());
        helper.addAttachment(attachmentPath.getFileName().toString(), file);
        
        emailSender.send(message);

    }
}