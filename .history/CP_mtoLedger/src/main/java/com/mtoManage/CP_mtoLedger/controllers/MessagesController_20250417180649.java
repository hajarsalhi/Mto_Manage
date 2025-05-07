package com.mtoManage.CP_mtoLedger.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mtoManage.CP_mtoLedger.models.TresoMessages;
import com.mtoManage.CP_mtoLedger.services.impl.MessagesService;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessagesController {
    
    @Autowired
    private  MessagesService messagesService;

    @GetMapping("/system-messages")
    public List<TresoMessages> getSystemMessages() {
        return messagesService.getSystemMessages();
    }
}
