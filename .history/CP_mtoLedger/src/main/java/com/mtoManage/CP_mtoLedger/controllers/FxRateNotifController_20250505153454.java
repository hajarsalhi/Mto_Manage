package com.mtoManage.CP_mtoLedger.controllers;

import java.util.ArrayList;
import java.util.List;

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
import com.mtoManage.CP_mtoLedger.dto.FxRateNotifResponse;
import com.mtoManage.CP_mtoLedger.models.TresoNotifications;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.services.impl.TresoFxRateNotifService;

@RestController
@RequestMapping("/api/fx-rate-notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class FxRateNotifController {

    @Autowired
    private TresoFxRateNotifService tresoFxRateNotifService;
    private TresoProductRepository  tresoProductRepository;

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
    public ResponseEntity<List<FxRateNotifResponse>> getAllSentNotif() {
        List<FxRateNotifResponse> notifications = new ArrayList<>();
        for(TresoNotifications notification : tresoFxRateNotifService.getAllSentNotif()) {
            FxRateNotifResponse response = new FxRateNotifResponse();
            TresoProduct product = tresoProductRepository.findById(notification.getProductId()) 
                    .orElse(null);
            if (product != null) {
                response.setRecipients(product.getEmail().split(","));
            }
            response.setDate(notification.getDate());
            response.setType(notification.getType());
            response.setSubject("Daily FX Rate Update_"+notification.getDate());
            response.setStatus(notification.getReceived());
            notifications.add(response);
        }
        return ResponseEntity.ok(notifications);
    }
}
