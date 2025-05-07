package com.mtoManage.CP_mtoLedger.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mtoManage.CP_mtoLedger.services.impl.RiskValueServiceImpl;

@RestController
@RequestMapping("/api/risk-value")
public class RiskValueController {

    @Autowired
    private  RiskValueServiceImpl riskValueService;

    @PostMapping("/create")
    public ResponseEntity<RiskValueResponse> createRiskValue(@RequestBody RiskValueRequest request) {
        // Logic to create a new risk value
        RiskValueResponse response = riskValueService.createRiskValue(request);
        return ResponseEntity.ok(response);
    }
    
}
