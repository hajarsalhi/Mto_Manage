package com.mtoManage.CP_mtoLedger.services.impl;

import com.mtoManage.CP_mtoLedger.dto.RateReferenceRequest;
import com.mtoManage.CP_mtoLedger.dto.RateReferenceResponse;
import com.mtoManage.CP_mtoLedger.models.TresoBkam;
import com.mtoManage.CP_mtoLedger.repositories.TresoBkamRepository;
import com.mtoManage.CP_mtoLedger.services.TauxBkamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TauxBkamServiceImpl implements TauxBkamService {

    @Autowired
    private TresoBkamRepository tresoBkamRepository;

    @Override
    public List<RateReferenceResponse> getLatestRates() {
        // For simplicity, we'll return the latest rates for EUR and USD
        List<String> currencies = Arrays.asList("EUR", "USD");
        
        return currencies.stream()
            .map(currency -> {
                TresoBkam latestRate = tresoBkamRepository.findTopBySDeviseOrderByDDateDesc(currency)
                    .orElse(new TresoBkam());
                
                return new RateReferenceResponse(
                    latestRate.getId(),
                    currency,
                    latestRate.getFCoursVirement() != null ? latestRate.getFCoursVirement().doubleValue() : 0.0,
                    latestRate.getDDate() != null ? latestRate.getDDate().toString() : ""
                );
            })
            .collect(Collectors.toList());
    }

    @Override
    public TresoBkam updateRate(RateReferenceRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        TresoBkam newRate = new TresoBkam();
        newRate.setDevise(request.getDevise());
        newRate.setFCoursVirement(BigDecimal.valueOf(request.getCoursVirement()));
        newRate.setDDate(LocalDateTime.now());
        newRate.setDDateBkam(LocalDateTime.now());
        newRate.setSSource(request.getSource());
        newRate.setSCreatedBy(username);
        
        return tresoBkamRepository.save(newRate);
    }
} 