package com.mtoManage.CP_mtoLedger.controllers;
import org.springframework.beans.factory.annotation.Autowired;

import com.mtoManage.CP_mtoLedger.dto.CompensationData;
import com.mtoManage.CP_mtoLedger.dto.UploadResponse;
import com.mtoManage.CP_mtoLedger.models.TresoCompenTemp;
import com.mtoManage.CP_mtoLedger.models.TresoCompensation;
import com.mtoManage.CP_mtoLedger.repositories.TresoCompensationRepository;
import com.mtoManage.CP_mtoLedger.services.CompensationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compensation")
@CrossOrigin(origins = "http://localhost:3000")
public class CompensationController {


    @Autowired
    private CompensationService compensationService;

    @Autowired
    private TresoCompensationRepository compensationRepository;



    @GetMapping("/getTempComp")
    public ResponseEntity<?> getAllTempCompensations() {
        
        try{
            List<TresoCompenTemp> uploadedCompensations = compensationService.getAllTempCompen().stream().filter(comp -> comp.getValide() == 0).toList();
           System.out.println("Returning uploaded compensations size: " + uploadedCompensations.size());
            return ResponseEntity.ok(uploadedCompensations);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching uploaded compensations: " + e.getMessage());
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateCompensations(@RequestBody Map<String, List<Integer>> request) {
        try {
            List<Integer> compensationIds = request.get("compensationIds");
            if (compensationIds == null || compensationIds.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "No compensation IDs provided"));
            }
            
            compensationService.validateCompensations(compensationIds);
            
            return ResponseEntity.ok()
                .body(Map.of(
                    "success", true,
                    "message", "Successfully validated " + compensationIds.size() + " compensations"
                ));
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Failed to validate compensations: " + e.getMessage()
                ));
        }
    }
    
    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadCSV(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    UploadResponse.builder()
                        .success(false)
                        .message("Please select a file")
                        .totalRecords(0)
                        .validRecords(0)
                        .errors(null)
                        .build()
                );
            }
    
            if (!file.getOriginalFilename().endsWith(".csv")) {
                return ResponseEntity.badRequest().body(
                    UploadResponse.builder()
                        .success(false)
                        .message("Please upload a CSV file")
                        .totalRecords(0)
                        .validRecords(0)
                        .errors(null)
                        .build()
                );
            }
    
            return ResponseEntity.ok(compensationService.processCSVFile(file));
    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UploadResponse.builder()
                        .success(false)
                        .message("Failed to upload file: " + e.getMessage())
                        .totalRecords(0)
                        .validRecords(0)
                        .errors(null)
                        .build());
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<TresoCompensation>> getCompensationsByProductId(
            @PathVariable Integer productId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        // TODO: Implement service logic
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getValidComp")
    public ResponseEntity<List<CompensationData>> getValidCompensations() {
        List<TresoCompensation> validCompensations = compensationRepository.findAll();
        List<CompensationData> compensationsData = new ArrayList<>(); // Initialize the list to store CompensationData objects
        for(TresoCompensation compensation : validCompensations) {
            CompensationData compensationData = new CompensationData().builder()
                .id(1)
                .date(LocalDate.now())
                .mtoName("MTO Name")
                .compensation(new BigDecimal("1000.00"))
                .fxRate(new BigDecimal("1.00"))
                .currency("USD")
                .build();

            compensationsData.add(compensationData);
        }
        

        
        return ResponseEntity.ok(compensationsData);
    }
} 