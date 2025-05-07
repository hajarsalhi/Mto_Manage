package com.mtoManage.CP_mtoLedger.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.dto.FxRateNotifRequest;
import com.mtoManage.CP_mtoLedger.repositories.TresoActivationNotifRepository;

@Service
public class TresoFxRateNotifService {

    @Autowired
    private TresoActivationNotifRepository activationNotifRepository;

    public void enableFxRateNotification(FxRateNotifRequest request) {
    
        // Check if the notification is already enabled
        if (request.getEnabled().booleanValue()) {
            // If it exists, update the existing record
            activationNotifRepository.updateNotificationStatus(request.getId(), request.isEnabled());
        } else {
            // If it doesn't exist, create a new record
            activationNotifRepository.save(new TresoActivationNotif(request.getId(), request.isEnabled()));
        }
        
    }

}
