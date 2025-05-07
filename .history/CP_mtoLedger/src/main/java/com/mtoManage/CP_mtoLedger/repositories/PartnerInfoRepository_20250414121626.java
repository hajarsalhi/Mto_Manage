package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.PartnerInfo;
import com.mtoManage.CP_mtoLedger.models.PartnerX;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartnerInfoRepository extends JpaRepository<PartnerX, Integer> {
} 