package com.mtoManage.CP_mtoLedger.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.models.TresoMessages;
import com.mtoManage.CP_mtoLedger.repositories.TresoMessagesRepository;

@Service
public class MessagesService {
    
    @Autowired
    private TresoMessagesRepository messagesRepository;

    public List<TresoMessages> getSystemMessages(){
        return messagesRepository.findAll();
    }
}
