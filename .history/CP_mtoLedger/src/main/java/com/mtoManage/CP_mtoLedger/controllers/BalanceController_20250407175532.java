package com.mtoManage.CP_mtoLedger.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.services.impl.BalanceServiceImpl;

@RestController
@RequestMapping("/api/balance")
@CrossOrigin(origins = "http://localhost:3000")
public class BalanceController {


    @Autowired
    private BalanceServiceImpl balanceService;
    
    @GetMapping("/getBalances")
    public List<TresoBalance> getBalances() {
        try {
            return balanceService.getBalances();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/getProductbalance/{productId}")
    public TresoBalance getBalanceByProductId(String productId) {
        try {
            return balanceService.getBalanceByProductId(Integer.parseInt(productId));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
