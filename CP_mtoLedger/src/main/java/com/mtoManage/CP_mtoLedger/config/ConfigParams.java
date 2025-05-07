package com.mtoManage.CP_mtoLedger.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.config")
public class ConfigParams {
    private String awsKey;
    private String awsSecretKey;
    private String awsRegion;
    private String awsBucketName;
    private String mailFrom;
    private String mailCcTeam;
    private String mailUsername;
    private String mailPassword;
    private String mailServer;
    private Integer mailPort;
}
