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
    
        System.out.println(request);
        // Check if the notification is already enabled
        if (request.getId() != null && request.getEnabled()) {
            // If it exists, update the existing record
            activationNotifRepository.updateNotificationStatus(request.getId(), !request.getEnabled());
        } else {
            // If it doesn't exist, create a new record
            TresoActivationNotif tresoActivationNotif= new TresoActivationNotif();
            tresoActivationNotif.setState(request.getEnabled());
            tresoActivationNotif.setDate(LocalDate.now());
            tresoActivationNotif.setDateActivation(LocalDateTime.now());
            tresoActivationNotif.setCreatedBy(request.getCreatedBy());

            activationNotifRepository.save(tresoActivationNotif);
        }
        
    }


    public FxRateNotifRequest getNotificationStatus() {
        TresoActivationNotif notification =  activationNotifRepository
                .findTopByOrderByDateActivationDesc(LocalDate.now());

                FxRateNotifRequest request = new FxRateNotifRequest();
                request.setEnabled(notification.getState());
                request.setLastSent(notification.getDateActivation());
                request.setId(notification.getId());
                request.setCreatedBy(notification.getCreatedBy());

        return request;
    }
}
