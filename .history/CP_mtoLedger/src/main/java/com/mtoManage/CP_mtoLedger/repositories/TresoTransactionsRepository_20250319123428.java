package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TresoTransactionsRepository extends JpaRepository<TresoTransactions, Integer> {
} 