package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Treso_Config_Params", schema = "dbo")
public class TresoConfigParams {
    @Id
    @Column(name = "nId")
    private Integer id;

    @Column(name = "mailServer", length = 100)
    private String mailServer;

    @Column(name = "mailPort")
    private Integer mailPort;

    @Column(name = "mailUsername", length = 100)
    private String mailUsername;

    @Column(name = "mailPassword", length = 100)
    private String mailPassword;

    @Column(name = "mailFrom", length = 100)
    private String mailFrom;

    @Column(name = "mailCcTeam", length = 100)
    private String mailCcTeam;

    @Column(name = "mailToTresoTeam", length = 100)
    private String mailToTresoTeam;

    @Column(name = "bkamApimSubscriptionKey", length = 100)
    private String bkamApimSubscriptionKey;

    @Column(name = "xoom_sftp_server", length = 100)
    private String xoomSftpServer;

    @Column(name = "xoom_sftp_port", length = 100)
    private String xoomSftpPort;

    @Column(name = "xoom_sftp_username", length = 100)
    private String xoomSftpUsername;

    @Column(name = "xoom_sftp_password", length = 100)
    private String xoomSftpPassword;

    @Column(name = "awsKey", length = 30)
    private String awsKey;

    @Column(name = "awsSecretKey", length = 50)
    private String awsSecretKey;

    @Column(name = "awsRegion", length = 20)
    private String awsRegion;

    @Column(name = "awsBucketName", length = 40)
    private String awsBucketName;

    // Getters and Setters
} 