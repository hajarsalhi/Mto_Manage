package com.mtoManage.CP_mtoLedger.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mtoManage.CP_mtoLedger.dto.FxRateNotifRequest;
import com.mtoManage.CP_mtoLedger.services.impl.TresoFxRateNotifService;

@RestController
@RequestMapping("/api/fx-rate-notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class FxRateNotifController {

    @Autowired
    private TresoFxRateNotifService tresoFxRateNotifService;

    @PostMapping("/enableFxRateNotification")
    public ResponseEntity<?> enableFxRateNotification(@RequestBody FxRateNotifRequest request) {
        tresoFxRateNotifService.enableFxRateNotification(request);
        return ResponseEntity.ok("FX rate notification status updated");
    }
    
    @GetMapping("/status")
    public ResponseEntity<FxRateNotifRequest> getNotificationStatus() {
        FxRateNotifRequest status = tresoFxRateNotifService.getNotificationStatus();
        return ResponseEntity.ok(status);
    }

    @GetMapping("/getAllSentNotif")
    public ResponseEntity<?> getAllSentNotif() {
        return ResponseEntity.ok(tresoFxRateNotifService.getAllSentNotif());
    }
}
