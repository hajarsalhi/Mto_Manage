package com.mtoManage.CP_mtoLedger.services.impl;

import com.mtoManage.CP_mtoLedger.dto.CSVError;
import com.mtoManage.CP_mtoLedger.dto.UploadResponse;
import com.mtoManage.CP_mtoLedger.models.TresoCompenTemp;
import com.mtoManage.CP_mtoLedger.models.TresoCompensation;
import com.mtoManage.CP_mtoLedger.models.TresoProduct;
import com.mtoManage.CP_mtoLedger.models.TresoCurrentBalance;
import com.mtoManage.CP_mtoLedger.models.TresoMessages;
import com.mtoManage.CP_mtoLedger.models.TresoBalance;
import com.mtoManage.CP_mtoLedger.models.TresoBalanceId;
import com.mtoManage.CP_mtoLedger.repositories.CompensationRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCompenTempRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoCompensationRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoProductRepository;
import com.mtoManage.CP_mtoLedger.services.CompensationService;
import com.mtoManage.CP_mtoLedger.repositories.TresoCurrentBalanceRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoMessagesRepository;
import com.mtoManage.CP_mtoLedger.repositories.TresoBalanceRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@Service
public class CompensationServiceImpl implements CompensationService {
    
    private final CompensationRepository compensationRepository;

    
    private final TresoCompenTempRepository compensationTempRepository;

    @Autowired
    private TresoCompensationRepository tresoCompensationRepository;

    @Autowired
    private TresoBalanceRepository tresoBalanceRepository;

    @Autowired
    private TresoProductRepository tresoProductRepository;

    @Autowired
    private TresoCurrentBalanceRepository currentBalanceRepository;

    @Autowired
    private TresoMessagesRepository tresoMessagesRepository;

    @Autowired
    public CompensationServiceImpl(CompensationRepository compensationRepository,
                                TresoCompenTempRepository compensationTempRepository) {
        this.compensationRepository = compensationRepository;
        this.compensationTempRepository = compensationTempRepository;
    }

    @Override
    public List<TresoCompensation> getAllCompensations() {
        return compensationRepository.findAll();
    }


    @Override
    public List<TresoCompenTemp> getAllTempCompen() {
        return compensationTempRepository.findAll();
    }


    @Override
    public Optional<TresoCompensation> getCompensationById(Integer id) {
        return compensationRepository.findById(id);
    }


    @Override
    public UploadResponse processCSVFile(MultipartFile file) throws IOException {
        List<CSVError> errors = new ArrayList<>();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        int totalRecords = 0;
        int validRecords = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            // Skip header
            String header = reader.readLine();
            if(header.contains("0xFEFF"))
                header.replace("0xFEFF", "");
            if (!isValidHeader(header)) {
                return new UploadResponse(false, "Invalid CSV header format", 0, 0, 
                    List.of(new CSVError(1, "Expected headers: reference, date, id MTO, nom MTO, montant, fx rate, devise"+" Actual "+header)));
            }

            String line;
            int lineNumber = 2; // Start after header
            while ((line = reader.readLine()) != null) {
                totalRecords++;
                try {
                    if (processLine(line)) {
                        validRecords++;
                    } else {
                        errors.add(new CSVError(lineNumber, "Invalid data format"));
                    }
                } catch (Exception e) {
                    errors.add(new CSVError(lineNumber, e.getMessage()));
                }
                lineNumber++;
            }
        }

            boolean success = errors.isEmpty();
            String message = success ? 
                "File uploaded successfully" : 
                "File uploaded with validation errors";

            TresoMessages tresoMessage = new TresoMessages();
            tresoMessage.setDate(LocalDateTime.now());
            tresoMessage.setMessage("<i style=\"color:blue\" class=\"fa fa-check-circle\"></i> Compensations for "+LocalDate.now()+"were uploaded by" + username );
            tresoMessagesRepository.save(tresoMessage);

            return new UploadResponse(success, message, totalRecords, validRecords, errors);
    }

    private static String convertDateFormat(String oldDate) {
        try {
            SimpleDateFormat oldFormat = new SimpleDateFormat("dd-MM-yyyy");
            SimpleDateFormat newFormat = new SimpleDateFormat("yyyy-MM-dd");
            return newFormat.format(oldFormat.parse(oldDate));
        } catch (ParseException e) {
            System.err.println("Invalid date format: " + oldDate);
            return oldDate; // Return original if parsing fails
        }
    }
    
    private boolean isValidHeader(String header) {
        String[] expectedHeaders = {
            "reference", "date", "id MTO", "nom MTO", "montant", "fx rate", "devise"
        };
        String[] actualHeaders = header.split(",");
        
        return Arrays.equals(
            Arrays.stream(expectedHeaders).map(String::trim).toArray(),
            Arrays.stream(actualHeaders).map(String::trim).toArray()
        );
    }
    
    private boolean processLine(String line) {
        try {
            String[] values = line.split(",");
            if (values.length != 7) {
                return false;
            }

            // Parse and validate values
            String reference = values[0].trim();
            LocalDate sendDate = LocalDate.parse(values[1].trim());
            Integer mtoId = Integer.parseInt(values[2].trim());
            String mtoName = values[3].trim();
            BigDecimal amount = new BigDecimal(values[4].trim());
            BigDecimal fxRate = new BigDecimal(values[5].trim());
            String currency = values[6].trim();

            // Create and save TresoCompensation entity
            TresoCompenTemp compensation = TresoCompenTemp.builder()
                .reference(reference)
                .date(sendDate)
                .productId(mtoId)
                .productName(mtoName)
                .compensation(amount)
                .taux(fxRate)
                .insertion(LocalDateTime.now())
                .valide(0)
                .build();

            compensationTempRepository.save(compensation);
            return true;

        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Expected format: YYYY-MM-DD");
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid number format for amount, fx rate, or MTO ID");
        } catch (Exception e) {
            throw new IllegalArgumentException("Error processing line: " + e.getMessage());
        }
    }
    


    @Override
    public List<TresoCompensation> getCompensationsByProductId(Integer productId, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return compensationRepository.findByProductIdAndDateBetween(productId, startDate, endDate);
        }
        return compensationRepository.findByProductId(productId);
    }

    @Override
    @Transactional
    public void validateCompensations(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("No compensation IDs provided for validation");
        }

        // Fetch all temporary compensations by IDs
        List<TresoCompenTemp> tempCompensations = compensationTempRepository.findAllById(ids);
        
        if (tempCompensations.isEmpty()) {
            throw new IllegalArgumentException("No temporary compensations found with the provided IDs");
        }
        
        // Verify all product IDs exist in treso_product table
        for (TresoCompenTemp tempComp : tempCompensations) {
            Optional<TresoProduct> product = tresoProductRepository.findById(tempComp.getProductId());
            if (!product.isPresent()) {
                throw new IllegalArgumentException("Product ID " + tempComp.getProductId() + " does not exist in treso_product table");
            }
        }
        
        List<TresoCompensation> newCompensations = new ArrayList<>();
        
        // Convert each temporary compensation to a permanent one
        for (TresoCompenTemp tempComp : tempCompensations) {
            // Create a new TresoCompensation entity 
            TresoCompensation compensation = new TresoCompensation();
            compensation.setReference(tempComp.getReference());
            compensation.setDate(tempComp.getDate());
            compensation.setProductId(tempComp.getProductId());
            compensation.setProductName(tempComp.getProductName());
            compensation.setCompensation(tempComp.getCompensation());
            compensation.setTaux(tempComp.getTaux());
            compensation.setInsertion(LocalDateTime.now());
            
            newCompensations.add(compensation);

            // Mark the temporary compensation as validated
            tempComp.setValide(1);
            //update the balances 
            updateBalances(tempComp.getProductId(), tempComp.getCompensation());
        }
        
        // Save all new compensations
        tresoCompensationRepository.saveAll(newCompensations);
        
        // Update all temporary compensations
        compensationTempRepository.saveAll(tempCompensations);
    }


    public void updateBalances(Integer productId, BigDecimal amount){
        TresoCurrentBalance currentBalance = currentBalanceRepository.findByProductId(productId).orElse(null);
        if (currentBalance == null) {
            currentBalance = new TresoCurrentBalance();
            currentBalance.setProductId(productId);
            currentBalance.setBalance(BigDecimal.ZERO);
        }
        currentBalance.setBalance(currentBalance.getBalance().add(amount));
        currentBalance.setDateUpdate(LocalDateTime.now());
        currentBalanceRepository.save(currentBalance);

        TresoBalance realisationBalance = tresoBalanceRepository.findByProductId(productId);
        if (realisationBalance == null) {
            realisationBalance = new TresoBalance();
            realisationBalance.setId(new TresoBalanceId(LocalDate.now(), productId));
            realisationBalance.setBalance(BigDecimal.ZERO);
        }
        realisationBalance.setBalance(realisationBalance.getBalance().add(amount));
        realisationBalance.setDateUpdate(LocalDateTime.now());
        tresoBalanceRepository.save(realisationBalance);
    }
}
