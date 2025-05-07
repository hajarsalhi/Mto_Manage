package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoScheduler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface TresoSchedulerRepository extends JpaRepository<TresoScheduler, Integer> {
    
    @Query("SELECT COUNT(t) > 0 FROM TresoScheduler t WHERE t.date = :date AND t.schedulerName = :name AND t.state = :state")
    boolean existsByDateAndNameAndState(
        @Param("date") LocalDate date,
        @Param("name") String name,
        @Param("state") boolean state
    );
} 