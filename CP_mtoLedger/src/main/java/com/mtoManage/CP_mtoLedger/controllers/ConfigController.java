package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.models.TresoConfigParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @GetMapping
    public ResponseEntity<TresoConfigParams> getConfig() {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<TresoConfigParams> updateConfig(@RequestBody TresoConfigParams config) {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }
} 