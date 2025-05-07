package com.mtoManage.CP_mtoLedger.repositories;

import com.mtoManage.CP_mtoLedger.models.TresoScheduler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TresoSchedulerRepository extends JpaRepository<TresoScheduler, Integer> {
    
    @Query(value = "SELECT t FROM TresoScheduler t WHERE CAST(t.date as date) >= :date AND CAST(t.date as date) < :nextDate AND t.schedulerName = :name AND t.state = :state")
    List<TresoScheduler> findMatchingSchedulers(
        @Param("date") LocalDate date,
        @Param("nextDate") LocalDate nextDate,
        @Param("name") String name,
        @Param("state") Integer state
    );

    @Query("SELECT COUNT(t) > 0 FROM TresoScheduler t WHERE t.date >= :startOfDay AND t.date < :nextDay AND t.schedulerName = :name AND t.state = :state")
    boolean existsByDateAndNameAndState(
        @Param("startOfDay") LocalDateTime startOfDay,
        @Param("nextDay") LocalDateTime nextDay,
        @Param("name") String name,
        @Param("state") Integer state
    );
} 