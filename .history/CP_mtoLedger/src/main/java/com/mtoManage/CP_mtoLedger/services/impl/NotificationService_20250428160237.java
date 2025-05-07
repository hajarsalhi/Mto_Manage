package com.mtoManage.CP_mtoLedger.services.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.models.TresoMessages;
import com.mtoManage.CP_mtoLedger.models.TresoScheduler;
import com.mtoManage.CP_mtoLedger.repositories.TresoMessagesRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoNotificationsRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoSchedulerRepository;

@Service
public class NotificationService {
    
    @Autowired
    TresoMessagesRepository messagesRepository;

    public void notifynotifyMessage(LocalDateTime date , String message){

        TresoMessages messages = new TresoMessages();
        messages.setDate(date);
        messages.setMessage("<i style=\"color:green\" class=\"fa fa-check\"></i>" + message);

        messagesRepository.save(messages);
    }
}
