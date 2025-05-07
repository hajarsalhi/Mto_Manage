package com.mtoManage.CP_mtoLedger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CpMtoLedgerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CpMtoLedgerApplication.class, args);
	}

}
