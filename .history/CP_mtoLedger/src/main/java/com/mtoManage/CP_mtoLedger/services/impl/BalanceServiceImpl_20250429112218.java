package com.mtoManage.CP_mtoLedger.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoBkam;
import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import com.mtoManage.CP_mtoLedger.models.TresoMessages;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.models.TresoCorrection;
import com.mtoManage.CP_mtoLedger.models.TresoTransactions;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCurrentBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoMessagesRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCorrectionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoTransactionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.services.BalanceService;
import com.mtoManage.CP_mtoLedger.repositories.TresoBkamRepository;
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

    @Autowired
    private TresoProductRepository productRepository;

    @Autowired
    private TresoBkamRepository bkamRepository;

    @Override
    public List<TresoBalance> getBalances() {
        return balanceRepository.findAll();
    }

    @Override
    public TresoBalance getBalanceByProductId(Integer productId) {
        return balanceRepository.findByProductId(productId);
    }

    @Override
    public String updateBalances(Integer productId, EditCurrentBalanceRequest request) {
    
        // Get the current balance record
        TresoCurrentBalance currentBalance = currentBalanceRepository.findByProductId(productId)
                .orElse(null);
        if (currentBalance == null) {
            return "Current balance not found";
        }

        TresoProduct product = productRepository.findById(productId)
                .orElse(null);

        TresoBkam bkam = bkamRepository.findLatestByDevise(product.getProductDeviseFx())
                .orElse(null);


        TresoCorrection correction = new TresoCorrection();
        TresoTransactions transaction = new TresoTransactions();
        correction.setCorrectedBy(1);
        if(!product.getProductDeviseFx().equalsIgnoreCase("MAD") && bkam != null) {
            correction.setCorrection(request.getCorrectionAmount().multiply(bkam.getCoursVirement()));
            transaction.setAmountDH(request.getCorrectionAmount().multiply(bkam.getCoursVirement()));
        } else {
            correction.setCorrection(request.getCorrectionAmount());
            transaction.setAmountDH(request.getCorrectionAmount());
        }
        correction.setOldBalance(currentBalance.getCurrentBalance());
        correction.setProductId(productId);
        correction.setDate(LocalDateTime.now());
        correction.setMotif(request.getReason());
        correctionRepository.save(correction);

        //Track the correction as a transaction
        
        transaction.setDate(LocalDateTime.now());
        transaction.setAmountDevise(request.getCorrectionAmount().multiply(new BigDecimal(-1)));
        transaction.setTransactionId(productId+2000000);
        transaction.setProductId(productId);
        transaction.setCorrection(true);
        transaction.setTransactionCode("Correction");
        transactionRepository.save(transaction);

        // Update the balance
        currentBalance.setCurrentBalance(request.getNewBalance());
        currentBalance.setDateUpdate(LocalDateTime.now());
        currentBalanceRepository.save(currentBalance);

        TresoMessages message = new TresoMessages();
        message.setDate(LocalDateTime.now());
        message.setMessage("<i style=\"color:green\" class=\"fa fa-info-circle\"></i> Balance of Product" 
                + productId + "was updated successfully");
        messageRepository.save(message);


        


        return "Balance updated successfully";
        
    }
    
}
