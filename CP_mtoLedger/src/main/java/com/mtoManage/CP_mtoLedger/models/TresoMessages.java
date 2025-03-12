package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Messages", schema = "dbo")
public class TresoMessages {
    @Column(name = "sMessage", columnDefinition = "text")
    private String message;

    @Column(name = "dDate")
    private LocalDateTime date;

    @Column(name = "nAccessId")
    private Integer accessId;

    // Getters and Setters
} 