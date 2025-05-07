package com.mtoManage.CP_mtoLedger.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.dto.FxRateNotifRequest;
import com.mtoManage.CP_mtoLedger.models.TresoActivationNotif;
import com.mtoManage.CP_mtoLedger.repositories.TresoActivationNotifRepository;

@Service
public class TresoFxRateNotifService {

    @Autowired
    private TresoActivationNotifRepository activationNotifRepository;

    public void enableFxRateNotification(FxRateNotifRequest request) {
        System.out.println("Received request: " + request);
        
        // Check if there's already a notification for today
        TresoActivationNotif existingNotification = activationNotifRepository.findByDate(LocalDate.now())
            .orElse(null);
        
        if (existingNotification != null) {
            // If it exists, update the existing record
            existingNotification.setState(request.getEnabled());
            existingNotification.setDateActivation(LocalDateTime.now());
            existingNotification.setCreatedBy(request.getCreatedBy());
            activationNotifRepository.save(existingNotification);
        } else {
            // If it doesn't exist, create a new record
            TresoActivationNotif tresoActivationNotif = new TresoActivationNotif();
            tresoActivationNotif.setState(request.getEnabled());
            tresoActivationNotif.setDate(LocalDate.now());
            tresoActivationNotif.setDateActivation(LocalDateTime.now());
            tresoActivationNotif.setCreatedBy(request.getCreatedBy());

            activationNotifRepository.save(tresoActivationNotif);
        }
    }
    
    public FxRateNotifRequest getNotificationStatus() {
        TresoActivationNotif notification = activationNotifRepository
                .findTopByOrderByDateActivationDesc(LocalDate.now());
        
        if (notification == null) {
            // If no notification exists for today, return a default response
            FxRateNotifRequest defaultResponse = new FxRateNotifRequest();
            defaultResponse.setEnabled(false);
            defaultResponse.setLastSent(null);
            defaultResponse.setId(null);
            defaultResponse.setCreatedBy(null);
            return defaultResponse;
        }
        
        FxRateNotifRequest response = new FxRateNotifRequest();
        response.setEnabled(notification.getState());
        response.setLastSent(notification.getDateActivation());
        response.setId(notification.getId());
        response.setCreatedBy(notification.getCreatedBy());
        
        return response;
    }
}
