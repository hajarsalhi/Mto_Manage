package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Scheduler", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoScheduler {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

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
    
    @Column(name = "sErrorDetail")
    private String errorDetail;
} 
