package com.mtoManage.CP_mtoLedger.services.impl;
import com.amazonaws.services.s3.AmazonS3;
import com.mtoManage.CP_mtoLedger.config.ConfigParams;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;

@Service
public class EmailService {
    private static final String HEADER_COLUMN = "Date,Product,Transaction,FX Rate,Currency";
    
    @Autowired
    //private AmazonS3 amazonS3;
    
    @Autowired
    private ConfigParams configParams;
    
    @Autowired
    private SchedulerRepository schedulerRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private SchedulerService schedulerService;
    
    @Autowired
    private ReconciliationReportService reconciliationReportService;
    
    public void sendEmailWithAttachment(String to, String cc, String subject, String body, String bucketName, String s3FilePath, String fileName) {
        // Implementation for sending email with attachment
        // ...
    }
}