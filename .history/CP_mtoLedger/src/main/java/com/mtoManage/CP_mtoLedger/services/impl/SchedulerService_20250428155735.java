package com.mtoManage.CP_mtoLedger.services.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtoManage.CP_mtoLedger.models.TresoScheduler;
import com.mtoManage.CP_mtoLedger.repositories.TresoSchedulerRepository;

@Service
public class SchedulerService {
    @Autowired
    TresoSchedulerRepository schedulerRepository;

    public void notifySchedulerError( LocalDateTime date, String schedulerName, String errorTYpe,String errorDesc , String errorDetail){

        TresoScheduler scheduler = new TresoScheduler();
        scheduler.setDate(date);
        scheduler.setSchedulerName(schedulerName);
        scheduler.setErrorType(errorTYpe);
        scheduler.setErrorDesc(errorDesc);
        scheduler.setErrorDetail(errorDetail);

        schedulerRepository.save(scheduler);
    }
}
