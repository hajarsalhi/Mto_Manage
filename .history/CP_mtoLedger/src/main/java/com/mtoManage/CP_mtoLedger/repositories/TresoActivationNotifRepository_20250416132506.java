package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoActivationNotif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TresoActivationNotifRepository extends JpaRepository<TresoActivationNotif, Integer> {
    
    @Query("SELECT a FROM TresoActivationNotif a WHERE a.date = :date")
    Optional<TresoActivationNotif> findByDate(@Param("date") LocalDate date);
} 