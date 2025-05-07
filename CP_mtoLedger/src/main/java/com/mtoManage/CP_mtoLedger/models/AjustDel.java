package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Ajust_del", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AjustDel {
    @Id
    @Column(name = "nId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nTransactionId")
    private Integer transactionId;
}
