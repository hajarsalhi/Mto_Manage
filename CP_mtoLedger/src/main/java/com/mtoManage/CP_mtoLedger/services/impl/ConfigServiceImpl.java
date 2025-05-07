package com.mtoManage.CP_mtoLedger.services.impl;

import com.mtoManage.CP_mtoLedger.models.TresoConfigParams;
import com.mtoManage.CP_mtoLedger.repositories.ConfigRepository;
import com.mtoManage.CP_mtoLedger.services.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ConfigServiceImpl implements ConfigService {
    
    private final ConfigRepository configRepository;

    @Autowired
    public ConfigServiceImpl(ConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    @Override
    public Optional<TresoConfigParams> getConfig() {
        return configRepository.findById(1); // Assuming config is stored with ID 1
    }

    @Override
    public TresoConfigParams updateConfig(TresoConfigParams config) {
        return configRepository.save(config);
    }
} 