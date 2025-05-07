package com.mtoManage.CP_mtoLedger.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rateReference")
public class RateReferenceController {

    @Autowired
    private RateReferenceServiceImpl rateReferenceServiceImpl;
    
}
