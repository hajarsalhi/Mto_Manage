package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Bkam", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoBkam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "dDate")
    private LocalDateTime date;
    
    @Column(name = "sDevise", length = 6)
    private String devise;

    @Column(name = "fCoursVirement", precision = 18, scale = 4)
    private BigDecimal CoursVirement;
    
    @Column(name = "dDateBkam")
    private LocalDateTime dDateBkam;
    
    @Column(name = "sSource", length = 20)
    private String Source;
    
    @Column(name = "sCreatedBy", length = 30)
    private String CreatedBy;
} 