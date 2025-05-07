package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class ProductInfo {


    @Id
    @Column(name = "nId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; 

    @Column(name  ="bCanSendBank")
    private Boolean canSendBank;
    
    @Column(name  ="bCanSendCash")
    private Boolean canSendCash;

    
    
}
