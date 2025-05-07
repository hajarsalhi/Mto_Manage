package com.mtoManage.CP_mtoLedger.services.impl;

import com.mtoManage.CP_mtoLedger.models.TresoCommission;
import com.mtoManage.CP_mtoLedger.repositories.TresoCommissionRepository;
import com.mtoManage.CP_mtoLedger.services.TresoCommissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TresoCommissionServiceImpl implements TresoCommissionService {

    private final TresoCommissionRepository tresoCommissionRepository;

    @Override
    public List<TresoCommission> getAllCommissions() {
        return tresoCommissionRepository.findAll();
    }

    @Override
    public Optional<TresoCommission> getCommissionById(Integer id) {
        return tresoCommissionRepository.findById(id);
    }

    @Override
    public Optional<TresoCommission> getCommissionByProductId(Integer productId) {
        return tresoCommissionRepository.findTauxCommission(productId);
    }

    @Override
    public List<TresoCommission> getCommissionsWithRates() {
        return tresoCommissionRepository.findCommissionRate()
                .orElse(List.of());
    }

    @Override
    public TresoCommission saveCommission(TresoCommission commission) {
        return tresoCommissionRepository.save(commission);
    }

    @Override
    public void deleteCommission(Integer id) {
        tresoCommissionRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Integer id) {
        return tresoCommissionRepository.existsById(id);
    }
} 