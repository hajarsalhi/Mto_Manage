package com.mtoManage.CP_mtoLedger.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import com.mtoManage.CP_mtoLedger.models.TresoCorrection;
import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCurrentBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCorrectionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoTransactionRepository;
import com.mtoManage.CP_mtoLedger.services.BalanceService;

@Service
public class BalanceServiceImpl implements BalanceService {

    @Autowired
    private TresoBalanceRepository balanceRepository;

    @Autowired
    private TresoCurrentBalanceRepository currentBalanceRepository;

    @Autowired
    private TresoTransactionsRepository transactionRepository;

    @Autowired
    private TresoCorrectionRepository correctionRepository;

    @Override
    public List<TresoBalance> getBalances() {
        return balanceRepository.findAll();
    }

    @Override
    public TresoBalance getBalanceByProductId(Integer productId) {
        return balanceRepository.findByProductId(productId);
    }

    @Override
    public void updateBalances(Integer productId, EditCurrentBalanceRequest request) {
        TresoBalance balance = balanceRepository.findByProductId(productId);
        balance.setBalance(balance.getBalance().add(request.getCorrectionAmount()));
        balanceRepository.save(balance);


        // Get the current balance record
        TresoCurrentBalance currentBalance = currentBalanceRepository.findById(balanceId)
                .orElse(null);
        
        if (currentBalance == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update the balance
        currentBalance.setCurrentBalance(request.getBalance());
        currentBalance.setDateUpdate(LocalDateTime.now());
        currentBalanceRepository.save(currentBalance);


        //Track the correction as a transaction
        TresoTransactions transaction = new TresoTransactions();
        transaction.setDate(LocalDateTime.now());
        transaction.setAmountDH(request.getCorrectionAmount().multiply(new BigDecimal(-1)));
        transaction.setId(request.getBalanceId()+2000000);
        transaction.setType("Correction");
        transaction.setProductId(productId);
        transaction.setCorrection(1);
        transactionRepository.save(transaction);

        TresoCorrection correction = new TresoCorrection();
        correction.setCorrectedBy(currentBalance.getProductId())
        correction.setCorrection(request.getCorrectionAmount());
        correction.setOldBalance(currentBalance.getCurrentBalance());
        correction.setProductId(currentBalance.getProductId());
        correction.setDate(LocalDateTime.now());
        correction.setMotif(request.getReason());
        correctionRepository.save(correction);

        TresoMessages message = new TresoMessages();
        message.setDate(LocalDateTime.now());
        message.setMessage("<i style=\"color:green\" class=\"fa fa-info-circle\"></i> Balance of Product" 
                + currentBalance.getProductId() + "was updated successfully");
        messageRepository.save(message);
        
    }
    
}
