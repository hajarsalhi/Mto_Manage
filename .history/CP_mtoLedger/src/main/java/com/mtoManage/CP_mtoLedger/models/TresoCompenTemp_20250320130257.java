package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mtoManage.CP_mtoLedger.dto.LocalDateDeserializer;

@Entity
@Table(name = "Treso_Compen_temp", schema = "dbo", indexes = {
    @Index(name = "reference_partner_date", columnList = "nProductId,dDate")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoCompenTemp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "dDate")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate date;

    @Column(name = "nProductId")
    private Integer productId;

    @Column(name = "sProductName", length = 255)
    private String productName;

    @Column(name = "nCompensation", precision = 18, scale = 2)
    private BigDecimal compensation;

    @Column(name = "nCompTheorique", precision = 18, scale = 2)
    private BigDecimal compTheorique;

    @Column(name = "dInsertion")
    private LocalDateTime insertion;

    @Column(name = "fTaux", precision = 18, scale = 2)
    private BigDecimal taux;

    @Column(name = "sFileName", length = 255)
    private String fileName;

    @Column(name = "nAccessId")
    private Integer accessId;

    @Column(name = "bValide", nullable = false)
    private Integer valide = 0;

    @Column(name = "nCompCommission", precision = 18, scale = 2)
    private BigDecimal compCommission;

    @Column(name = "nReference", length = 50)
    private String reference;

    // Getters and Setters
} 