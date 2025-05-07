package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.dto.RateReferenceRequest;
import com.mtoManage.CP_mtoLedger.dto.RateReferenceResponse;
import com.mtoManage.CP_mtoLedger.models.TresoBkam;
import com.mtoManage.CP_mtoLedger.services.TauxBkamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taux-bkam")
@CrossOrigin(origins = "http://localhost:3000")
public class TauxBkamController {

    @Autowired
    private TauxBkamService tauxBkamService;

    @GetMapping
    public ResponseEntity<List<RateReferenceResponse>> getAllRates() {
        return ResponseEntity.ok(tauxBkamService.getLatestRates());
    }

    @PostMapping("/update")
    public ResponseEntity<RateReferenceResponse> updateRate(@RequestBody RateReferenceRequest request) {
        TresoBkam updatedRate = tauxBkamService.updateRate(request);
        return ResponseEntity.ok(new RateReferenceResponse(
            updatedRate.getId(),
            updatedRate.getDevise(),
            updatedRate.getCoursVirement().doubleValue(),
            updatedRate.getDate().toString()
        ));
    }
} 