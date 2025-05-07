package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Product_Info_Changes", schema = "dbo")
@Data
public class TresoProductInfoChanges {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "dDateUpdate")
    private LocalDateTime dateUpdate;

    @Column(name = "sColumnName", length = 50)
    private String columnName;

    @Column(name = "sDataBefore", length = 50)
    private String dataBefore;

    @Column(name = "sDataAfter", length = 50)
    private String dataAfter;

    @Column(name = "nChangedBy")
    private Integer changedBy;

    // Getters and Setters
} 