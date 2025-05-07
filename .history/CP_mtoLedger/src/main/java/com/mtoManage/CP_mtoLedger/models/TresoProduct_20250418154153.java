package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "Treso_Product", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoProduct {
    @Id
    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "sProductName", length = 255)
    private String productName;

    @Column(name = "sProductMethod", length = 255)
    private String productMethod;

    @Column(name = "bActive")
    private Integer active;

    @Column(name = "fFacilite", precision = 18, scale = 2)
    private BigDecimal facilite;

    @Column(name = "fMovingAvg", precision = 18, scale = 2)
    private BigDecimal movingAvg;

    @Column(name = "bDeblock")
    private Boolean deblock = false;

    @Column(name = "fMAwarning", precision = 18, scale = 2)
    private BigDecimal maWarning = new BigDecimal("1.25");

    @Column(name = "fMAblock", precision = 18, scale = 2)
    private BigDecimal maBlock = new BigDecimal("1.5");
    
    @Column(name = "sProductDeviseFx", length = 50)
    private String productDeviseFx;
    
    @Column(name = "fDecote", precision = 18, scale = 4)
    private BigDecimal decote;
    
    @Column(name = "sLibDecote", length = 50)
    private String libDecote;
    
    @Column(name = "sNotif", length = 50)
    private String notif;
    
    @Column(name = "dDateNotif")
    private LocalTime dateNotif;
    
    @Column(name = "sEmail", length = 255)
    private String email;
    
    @Column(name = "updatedBy", length = 50)
    private String updatedBy;
    
    @Column(name = "sSftpServer", length = 50)
    private String sftpServer;
    
    @Column(name = "nSftpPort")
    private Integer sftpPort;
    
    @Column(name = "sSftpUsername", length = 50)
    private String sftpUsername;
    
    @Column(name = "sSftpPassword", length = 50)
    private String sftpPassword;
    
    @Column(name = "sFileNameSuffix", length = 50)
    private String fileNameSuffix;
    
    @Column(name = "sFileNamePrefix", length = 50)
    private String fileNamePrefix;
    
    @Column(name = "sLocalDirectoryName", length = 50)
    private String localDirectoryName;
    
    @Column(name = "sRemoteDirectoryName", length = 50)
    private String remoteDirectoryName;
    
    @Column(name = "bUseClientCertificate")
    private Boolean useClientCertificate = false;
    
    @Column(name = "bSendReconciliationFile")
    private Boolean sendReconciliationFile;
    
    @Column(name = "sEmailReconciliation", length = 255)
    private String emailReconciliation;
    
    @Column(name = "nApplyDay")
    private Short applyDay;
    
    @Column(name = "tApplyHour")
    private LocalTime applyHour;
    
    @Column(name = "fFaciliteTemp", precision = 18, scale = 2)
    private BigDecimal faciliteTemp;
    
    @Column(name = "dDateFaciliteTemp")
    private LocalDateTime dateFaciliteTemp;
    
    @Column(name = "bBlocked")
    private Boolean blocked;
    
    @Column(name = "nBalanceProductId")
    private Integer balanceProductId;

    @OneToMany(mappedBy = "product")
    @JsonBackReference
    private List<TresoTransactions> transactions;

    @OneToMany(mappedBy = "product")
    @JsonBackReference
    private List<TresoNotifications> notifications;
    
    @OneToMany(mappedBy = "product")
    @JsonBackReference
    private List<TresoBalance> balances;
    
    @OneToMany(mappedBy = "product")
    @JsonBackReference
    private List<TresoCompensation> compensations;
    
    @OneToMany(mappedBy = "product")
    @JsonBackReference
    private List<TresoCommission> commissions;
    
    @OneToOne
    @JoinColumn(name = "nProductId", referencedColumnName = "nId")
    private Product product;

    @OneToOne(mappedBy = "nProductId")
    @JsonBackReference
    private PartnerInfo partnerInfo;
    
    @OneToOne(mappedBy = "product")
    @JsonBackReference
    private TresoCurrentBalance currentBalance;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nBalanceProductId", referencedColumnName = "nProductId", insertable = false, updatable = false)
    @JsonBackReference
    private TresoProduct balanceProduct;
    
    @OneToMany(mappedBy = "balanceProduct")
    @JsonBackReference
    private List<TresoProduct> relatedProducts;
    
    @OneToMany(mappedBy = "product")
    @JsonBackReference
    private List<TresoRiskValue> riskValues;

    // Getters and Setters
} 