package com.mtoManage.CP_mtoLedger.controllers;

import com.mtoManage.CP_mtoLedger.dto.TransactionData;
import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import com.mtoManage.CP_mtoLedger.repositories.TresoTransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    TresoTransactionRepository tresoTransactionRepository;

    @GetMapping("/getCompeletedTrans")
    public ResponseEntity<List<TransactionData>> getAllPaidTransactions() {
        List<TresoTransactions> transactions = tresoTransactionRepository.findAll();
        List<TransactionData> transactionDataList = new ArrayList<>();
        for (TresoTransactions transaction : transactions) {
            TransactionData transactionData = TransactionData.builder()
                    .id(transaction.getProductId())
                    .date(transaction.getDate().toLocalDate())
                    .mtoName(transaction.getProductName())
                    .transaction(transaction.getAmountDevise())
                    .fxRate(transaction.getTauxTheorique())
                    .currency(transaction.getDevise())
                    .build();
            transactionDataList.add(transactionData);
        }
        return ResponseEntity.ok(transactionDataList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TresoTransactions> getTransactionById(@PathVariable Integer id) {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<TresoTransactions> createTransaction(@RequestBody TresoTransactions transaction) {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<TresoTransactions>> getTransactionsByProductId(@PathVariable Integer productId) {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }
} 