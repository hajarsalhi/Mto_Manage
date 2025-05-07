package com.mtoManage.CP_mtoLedger.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Treso_Last_Ids", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TresoLastIds {
    @Id
    @Column(name = "context")
    private String context;

    @Column(name = "last_id")
    private Integer lastId;
}
