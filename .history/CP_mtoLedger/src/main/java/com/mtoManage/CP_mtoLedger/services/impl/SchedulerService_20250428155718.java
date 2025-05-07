package com.mtoManage.CP_mtoLedger.services.impl;

import org.springframework.stereotype.Service;

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
