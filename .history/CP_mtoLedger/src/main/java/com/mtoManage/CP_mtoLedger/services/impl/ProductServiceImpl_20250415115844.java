package com.mtoManage.CP_mtoLedger.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.models.TresoProductInfoChanges;
import com.mtoManage.CP_mtoLedger.repositories.TresoCommissionRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductInfoChangesRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.services.ProductService;
import com.mtoManage.CP_mtoLedger.dto.GetProductResponse;
import com.mtoManage.CP_mtoLedger.dto.ProductFinParams;
import com.mtoManage.CP_mtoLedger.dto.ProductRequestAdd;


@Service
public class ProductServiceImpl implements ProductService {


    @Autowired
    private TresoProductRepository productRepository;
    @Autowired
    private TresoCommissionRepository commissionRepository;

    @Autowired
    private TresoProductInfoChangesRepository productInfoChangesRepository;
    
    
    @Override
    public boolean existsById(Integer id) {
        return productRepository.existsById(id);
    }

    @Override
    public String getDeviseproduct(Integer id) {
        String devise = productRepository.getDeviseById(id);
        // Return default currency if none found
        return (devise != null && !devise.isEmpty()) ? devise : "USD";
    }

    @Override
    @Transactional(readOnly = true)
    public List<GetProductResponse> getAllProducts() {
        List<TresoProduct> products =  productRepository.findAll();
        List<GetProductResponse> productResponses = new ArrayList<>();
        for (TresoProduct product : products) {
            //get the latest commission
            TresoCommission tresoCommission = product.getCommissions().get(0);
            productResponses.add(new GetProductResponse
                (product.getProductId(),product.getProductName(),product.getActive(),tresoCommission.getTauxCommission()));
        }

        return productResponses;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductFinParams getProductParamsById(Integer id) {
        TresoProduct tresoProduct =  productRepository.findById(id).orElseThrow();
        TresoCommission tresoCommission = tresoProduct.getCommissions().get(0);
        return ProductFinParams.builder()
            .productId(tresoProduct.getProductId())
            .productName(tresoProduct.getProductName())
            .devise(tresoProduct.getProductDeviseFx())
            .active(tresoProduct.getActive())
            .prevTauxCommission(tresoCommission.getTauxCommission())
            .decote(tresoProduct.getDecote())
            .libDecote(tresoProduct.getLibDecote())
            .email(tresoProduct.getEmail())
            .reconciliationEmails(tresoProduct.getEmailReconciliation())
            .sendReconciliationReports(tresoProduct.getSendReconciliationFile())
            .productsMethod(tresoProduct.getProductMethod())
            .applyHour(tresoProduct.getApplyHour())
            .build();

    }

    @Override
    public List<TresoProduct> getAllProductsList() {
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public void createProduct(ProductRequestAdd product) {
        TresoProduct tresoProduct = productRepository.findById(product.getProductId()).orElseThrow();
        TresoCommission tresoComiission = new TresoCommission();
        tresoComiission.setTauxCommission(product.getCommission());
        tresoComiission.setProduct(tresoProduct);
        tresoProduct.setProductDeviseFx(product.getDevise());

        tresoProduct.setActive(1);
        productRepository.save(tresoProduct);
    }

    @Override
    public List<TresoProduct> getProductsWithoutCommission() {
        return productRepository.findProductsWithoutCommission();
    }

    @Override
    @Transactional
    public void updateProduct(Integer id, ProductFinParams product) {
        
        // Get the original product before updates
        TresoProduct originalProduct = productRepository.findById(id).orElseThrow();
        
        // Create a new commission
        TresoCommission tresoCommission = new TresoCommission();
        tresoCommission.setProduct(originalProduct);
        tresoCommission.setTauxCommission(product.getTauxCommission());
        tresoCommission.setProductType("TRANSFERT");
        tresoCommission.setProductSousType("INTERNATIONAL");
        tresoCommission.setTypeCommission("PERC");
        
        // Track commission rate change
        if (originalProduct.getCommissions() != null && !originalProduct.getCommissions().isEmpty()) {
            TresoCommission oldCommission = originalProduct.getCommissions().get(0);
            if (oldCommission.getTauxCommission() != null && 
                !oldCommission.getTauxCommission().equals(product.getTauxCommission())) {
                TresoProductInfoChanges commissionChange = new TresoProductInfoChanges();
                commissionChange.setProductId(originalProduct.getProductId());
                commissionChange.setDateUpdate(LocalDateTime.now());
                commissionChange.setColumnName("Taux_commission");
                commissionChange.setDataBefore(oldCommission.getTauxCommission().toString());
                commissionChange.setDataAfter(product.getTauxCommission().toString());
                productInfoChangesRepository.save(commissionChange);
            }
        }
        
        // Update product fields and track changes
        if (originalProduct.getActive() != null && product.getActive() != null && 
            !originalProduct.getActive().equals(product.getActive())) {
            TresoProductInfoChanges activeChange = new TresoProductInfoChanges();
            activeChange.setProductId(originalProduct.getProductId());
            activeChange.setDateUpdate(LocalDateTime.now());
            activeChange.setColumnName("bActive");
            activeChange.setDataBefore(originalProduct.getActive().toString());
            activeChange.setDataAfter(product.getActive().toString());
            productInfoChangesRepository.save(activeChange);
        }
        
        if (originalProduct.getProductDeviseFx() != null && product.getDevise() != null && 
            !originalProduct.getProductDeviseFx().equals(product.getDevise())) {
            TresoProductInfoChanges deviseChange = new TresoProductInfoChanges();
            deviseChange.setProductId(originalProduct.getProductId());
            deviseChange.setDateUpdate(LocalDateTime.now());
            deviseChange.setColumnName("sProductDeviseFx");
            deviseChange.setDataBefore(originalProduct.getProductDeviseFx());
            deviseChange.setDataAfter(product.getDevise());
            productInfoChangesRepository.save(deviseChange);
        }
        
        if (originalProduct.getApplyHour() != null && product.getApplyHour() != null && 
            !originalProduct.getApplyHour().equals(product.getApplyHour())) {
            TresoProductInfoChanges applyHourChange = new TresoProductInfoChanges();
            applyHourChange.setProductId(originalProduct.getProductId());
            applyHourChange.setDateUpdate(LocalDateTime.now());
            applyHourChange.setColumnName("tApplyHour");
            applyHourChange.setDataBefore(originalProduct.getApplyHour().toString());
            applyHourChange.setDataAfter(product.getApplyHour().toString());
            productInfoChangesRepository.save(applyHourChange);
        }
        
        if (originalProduct.getDecote() != null && product.getDecote() != null && 
            !originalProduct.getDecote().equals(product.getDecote())) {
            TresoProductInfoChanges decoteChange = new TresoProductInfoChanges();
            decoteChange.setProductId(originalProduct.getProductId());
            decoteChange.setDateUpdate(LocalDateTime.now());
            decoteChange.setColumnName("fDecote");
            decoteChange.setDataBefore(originalProduct.getDecote().toString());
            decoteChange.setDataAfter(product.getDecote().toString());
            productInfoChangesRepository.save(decoteChange);
        }
        
        if (originalProduct.getEmail() != null && product.getEmail() != null && 
            !originalProduct.getEmail().equals(product.getEmail())) {
            TresoProductInfoChanges emailChange = new TresoProductInfoChanges();
            emailChange.setProductId(originalProduct.getProductId());
            emailChange.setDateUpdate(LocalDateTime.now());
            emailChange.setColumnName("sEmail");
            emailChange.setDataBefore(originalProduct.getEmail());
            emailChange.setDataAfter(product.getEmail());
            productInfoChangesRepository.save(emailChange);
        }
        
        if (originalProduct.getEmailReconciliation() != null && product.getReconciliationEmails() != null && 
            !originalProduct.getEmailReconciliation().equals(product.getReconciliationEmails())) {
            TresoProductInfoChanges emailReconciliationChange = new TresoProductInfoChanges();
            emailReconciliationChange.setProductId(originalProduct.getProductId());
            emailReconciliationChange.setDateUpdate(LocalDateTime.now());
            emailReconciliationChange.setColumnName("sEmailReconciliation");
            emailReconciliationChange.setDataBefore(originalProduct.getEmailReconciliation());
            emailReconciliationChange.setDataAfter(product.getReconciliationEmails());
            productInfoChangesRepository.save(emailReconciliationChange);
        }
        
        if (originalProduct.getSendReconciliationFile() != null && product.getSendReconciliationReports() != null && 
            !originalProduct.getSendReconciliationFile().equals(product.getSendReconciliationReports())) {
            TresoProductInfoChanges sendReconciliationChange = new TresoProductInfoChanges();
            sendReconciliationChange.setProductId(originalProduct.getProductId());
            sendReconciliationChange.setDateUpdate(LocalDateTime.now());
            sendReconciliationChange.setColumnName("bSendReconciliationFile");
            sendReconciliationChange.setDataBefore(originalProduct.getSendReconciliationFile().toString());
            sendReconciliationChange.setDataAfter(product.getSendReconciliationReports().toString());
            productInfoChangesRepository.save(sendReconciliationChange);
        }
        
        // Update the product
        originalProduct.setActive(product.getActive());
        originalProduct.setProductDeviseFx(product.getDevise());
        originalProduct.setApplyHour(product.getApplyHour());
        originalProduct.setDecote(product.getDecote());
        originalProduct.setEmail(product.getEmail());
        originalProduct.setEmailReconciliation(product.getReconciliationEmails());
        originalProduct.setSendReconciliationFile(product.getSendReconciliationReports());
        
        // Add the new commission
        originalProduct.getCommissions().add(tresoCommission);
        
        // Save the updated product and commission
        productRepository.save(originalProduct);
        commissionRepository.save(tresoCommission);
    }


    
    

    
}
