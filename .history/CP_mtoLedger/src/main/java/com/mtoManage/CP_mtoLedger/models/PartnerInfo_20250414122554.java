package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

public class PartnerInfo {


    @Id
    @Column(name = "nId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; 

    @Column(name  ="bCanSendBank")
    private Boolean canSendBank;
    
    @Column(name  ="bCanSendCash")
    private Boolean canSendCash;

    @OneToOne
    @Column(name  ="nPartnerId")
    private PartnerX partnerX;

    
    
}
