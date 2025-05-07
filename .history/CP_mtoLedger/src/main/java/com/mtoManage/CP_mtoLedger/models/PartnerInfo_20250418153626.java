package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "PartnerInfo", schema = "dbo")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PartnerInfo {


    @Id
    @Column(name = "n_partner_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer partnerId; 

    @Column(name  ="bCanSendBank")
    private Integer canSendBank;
    
    @Column(name  ="bCanSendCash")
    private Integer canSendCash;

    @OneToOne(mappedBy = "nPartnerId")
    private TresoProduct tresoProduct;

    

    
    
}
