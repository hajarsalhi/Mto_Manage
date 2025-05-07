package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Treso_Messages", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoMessages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nId")
    private Integer id;

    @Column(name = "sType", length = 50)
    private String type;

    @Column(name = "sMessage", length = 1000)
    private String message;

    @Column(name = "dDate")
    private LocalDateTime date;

    @Column(name = "sStatus", length = 20)
    private String status;

    @Column(name = "sRecipients", length = 500)
    private String recipients;

    // Getters and Setters
} 