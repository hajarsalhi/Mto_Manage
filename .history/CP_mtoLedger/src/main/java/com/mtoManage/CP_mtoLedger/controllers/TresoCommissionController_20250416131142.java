package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import com.mtoManage.CP_mtoLedger.services.TresoCommissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TresoCommissionController {

    private final TresoCommissionService tresoCommissionService;

    @GetMapping
    public ResponseEntity<List<TresoCommission>> getAllCommissions() {
        return ResponseEntity.ok(tresoCommissionService.getAllCommissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TresoCommission> getCommissionById(@PathVariable Integer id) {
        return tresoCommissionService.getCommissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<TresoCommission> getCommissionByProductId(@PathVariable Integer productId) {
        return tresoCommissionService.getCommissionByProductId(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/with-rates")
    public ResponseEntity<List<TresoCommission>> getCommissionsWithRates() {
        List<TresoCommission> commissions = tresoCommissionService.getCommissionsWithRates();
        return ResponseEntity.ok(commissions);
    }

    @PostMapping
    public ResponseEntity<TresoCommission> createCommission(@RequestBody TresoCommission commission) {
        return ResponseEntity.ok(tresoCommissionService.saveCommission(commission));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TresoCommission> updateCommission(
            @PathVariable Integer id,
            @RequestBody TresoCommission commission) {
        if (!tresoCommissionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        commission.setId(id);
        return ResponseEntity.ok(tresoCommissionService.saveCommission(commission));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommission(@PathVariable Integer id) {
        if (!tresoCommissionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tresoCommissionService.deleteCommission(id);
        return ResponseEntity.ok().build();
    }
} 