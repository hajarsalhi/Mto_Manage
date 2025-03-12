package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Bkam", schema = "dbo")
public class TresoBkam {
    @Column(name = "dDate")
    private LocalDateTime date;

    @Column(name = "sDevise", length = 6)
    private String devise;

    @Column(name = "fCoursVirement", precision = 18, scale = 4)
    private BigDecimal coursVirement;

    @Column(name = "dDateBkam")
    private LocalDateTime dateBkam;

    @Column(name = "sSource", length = 20)
    private String source;

    @Column(name = "sCreatedBy", length = 30)
    private String createdBy;

    // Getters and Setters
} 