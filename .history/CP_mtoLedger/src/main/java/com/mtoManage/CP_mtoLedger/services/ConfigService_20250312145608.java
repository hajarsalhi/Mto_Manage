package com.mtoManage.CP_mtoLedger.services;

import com.mtoManage.CP_mtoLedger.models.TresoConfigParams;
import java.util.Optional;

public interface ConfigService {
    Optional<TresoConfigParams> getConfig();
    TresoConfigParams updateConfig(TresoConfigParams config);
} 