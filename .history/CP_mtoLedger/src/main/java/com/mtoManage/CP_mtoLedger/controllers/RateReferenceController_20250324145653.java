package com.mtoManage.CP_mtoLedger.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mtoManage.CP_mtoLedger.services.impl.RateReferenceServiceImpl;

@RestController
@RequestMapping("/api/rateReference")
public class RateReferenceController {

    @Autowired
    private RateReferenceServiceImpl rateReferenceServiceImpl;


    @PostMapping("/update")
    public ResponseEntity<?> updateRateReference(@RequestBody RequestEntity<?> request) {
        try {

            rateReferenceServiceImpl.updateRateReference(request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An error occurred");
        }


    }

    
}
