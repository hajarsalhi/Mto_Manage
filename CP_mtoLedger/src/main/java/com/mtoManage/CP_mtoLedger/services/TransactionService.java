package com.mtoManage.CP_mtoLedger.services;

import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import java.util.List;
import java.util.Optional;

public interface TransactionService {
    List<TresoTransactions> getAllTransactions();
    Optional<TresoTransactions> getTransactionById(Integer id);
    TresoTransactions createTransaction(TresoTransactions transaction);
    List<TresoTransactions> getTransactionsByProductId(Integer productId);
} 