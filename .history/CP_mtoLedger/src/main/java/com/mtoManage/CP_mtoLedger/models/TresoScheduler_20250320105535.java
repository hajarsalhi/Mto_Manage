package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

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

    @Column(name = "sName", length = 50)
    private String name;

    @Column(name = "sDescription", length = 255)
    private String description;

    @Column(name = "tTime")
    private LocalTime time;

    @Column(name = "bActive")
    private Boolean active;
} 