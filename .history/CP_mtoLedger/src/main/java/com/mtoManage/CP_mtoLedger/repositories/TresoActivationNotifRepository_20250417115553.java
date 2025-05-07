package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoActivationNotif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TresoActivationNotifRepository extends JpaRepository<TresoActivationNotif, Integer> {
    
    @Query("SELECT a FROM TresoActivationNotif a WHERE a.date = :date")
    Optional<TresoActivationNotif> findByDate(@Param("date") LocalDate date);


    @Query("UPDATE TresoActivationNotif a SET a.state = :status WHERE a.id = :id")
    @Modifying
    void updateNotificationStatus(@Param("id") Integer id, @Param("state") Boolean status);


    @Query("SELECT a.state FROM TresoActivationNotif a WHERE a.date = :date ORDER BY a.dateActivation DESC")
    TresoActivationNotif findTopByOrderByDateActivationDesc(@Param("date") LocalDate date);
} 