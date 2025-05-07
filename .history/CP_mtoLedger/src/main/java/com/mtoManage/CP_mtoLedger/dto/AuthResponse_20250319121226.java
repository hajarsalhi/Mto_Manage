package com.mtoManage.CP_mtoLedger.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private Long id;
    private String username;
    private String name;
    private String role;
    private String message;
    
    public AuthResponse(String accessToken, String message) {
        this.accessToken = accessToken;
        this.message = message;
    }
    
    public AuthResponse(String accessToken, Long id, String username, String name, String role) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.name = name;
        this.role = role;
    }
} 