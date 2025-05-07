package com.mtoManage.CP_mtoLedger.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mtoManage.CP_mtoLedger.dto.TauxBkamRequest;
import com.mtoManage.CP_mtoLedger.models.TresoBkam;
import com.mtoManage.CP_mtoLedger.services.impl.RateReferenceServiceImpl;

@RestController
@RequestMapping("/api/rateReference")
public class RateReferenceController {

    @Autowired
    private RateReferenceServiceImpl rateReferenceServiceImpl;


    @PostMapping("/update")
    public ResponseEntity<?> updateRateReference(@RequestBody TauxBkamRequest request) {
        try {

            rateReferenceServiceImpl.updateRateReference(TauxBkamRequest request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An error occurred");
        }


    }


    @GetMapping("/getLatest")
    public List<TresoBkam> getlatestBkam(){

        return rateReferenceServiceImpl.getLatestBkam();
    }

    
}
