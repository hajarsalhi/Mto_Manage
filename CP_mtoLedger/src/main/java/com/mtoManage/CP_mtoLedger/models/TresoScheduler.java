package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Scheduler", schema = "dbo")
public class TresoScheduler {
    @Column(name = "dDate")
    private LocalDateTime date;

    @Column(name = "sSchedulerName", length = 255)
    private String schedulerName;

    @Column(name = "bState")
    private Integer state;

    @Column(name = "sErrorType", length = 255)
    private String errorType;

    @Column(name = "sErrorDesc", length = 255)
    private String errorDesc;

    @Column(name = "sErrorDetail", columnDefinition = "text")
    private String errorDetail;

    // Getters and Setters
} 