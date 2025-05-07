package com.mtoManage.CP_mtoLedger.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import com.mtoManage.CP_mtoLedger.models.TresoMessages;
import com.mtoManage.CP_mtoLedger.models.TresoCorrection;
import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCurrentBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoMessagesRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCorrectionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoTransactionRepository;
import com.mtoManage.CP_mtoLedger.services.BalanceService;
import com.mtoManage.CP_mtoLedger.dto.EditCurrentBalanceRequest;

@Service
public class BalanceServiceImpl implements BalanceService {

    @Autowired
    private TresoBalanceRepository balanceRepository;

    @Autowired
    private TresoCurrentBalanceRepository currentBalanceRepository;

    @Autowired
    private TresoTransactionRepository transactionRepository;

    @Autowired
    private TresoCorrectionRepository correctionRepository;

    @Autowired
    private TresoMessagesRepository messageRepository;

    @Override
    public List<TresoBalance> getBalances() {
        return balanceRepository.findAll();
    }

    @Override
    public TresoBalance getBalanceByProductId(Integer productId) {
        return balanceRepository.findByProductId(productId);
    }

    @Override
    public void updateBalances(Integer balanceId, EditCurrentBalanceRequest request) {
        TresoCurrentBalance balance = currentBalanceRepository.findById(balanceId).orElse(null);   
        balance.setBalance(balance.getBalance().add(request.getCorrectionAmount()));
        currentBalanceRepository.save(balance);


        // Get the current balance record
        TresoCurrentBalance currentBalance = currentBalanceRepository.findById(balanceId)
                .orElse(null);
        
        // Update the balance
        currentBalance.setCurrentBalance(request.getNewBalance());
        currentBalance.setDateUpdate(LocalDateTime.now());
        currentBalanceRepository.save(currentBalance);


        //Track the correction as a transaction
        TresoTransactions transaction = new TresoTransactions();
        transaction.setDate(LocalDateTime.now());
        transaction.setAmountDH(request.getCorrectionAmount().multiply(new BigDecimal(-1)));
        transaction.setTransactionId(balanceId+2000000);
        transaction.setProductId(currentBalance.getProductId());
        transaction.setCorrection(true);
        transactionRepository.save(transaction);

        TresoCorrection correction = new TresoCorrection();
        correction.setCorrectedBy(currentBalance.getProductId());
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
