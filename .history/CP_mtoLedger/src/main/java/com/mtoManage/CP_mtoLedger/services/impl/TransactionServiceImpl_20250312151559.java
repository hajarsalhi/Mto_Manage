package com.mtoManage.CP_mtoLedger.services.impl;

import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import com.mtoManage.CP_mtoLedger.repositories.TransactionRepository;
import com.mtoManage.CP_mtoLedger.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<TresoTransactions> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Optional<TresoTransactions> getTransactionById(Integer id) {
        return transactionRepository.findById(id);
    }

    @Override
    public TresoTransactions createTransaction(TresoTransactions transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public List<TresoTransactions> getTransactionsByProductId(Integer productId) {
        return transactionRepository.findByProductId(productId);
    }
} 