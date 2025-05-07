package com.mtoManage.CP_mtoLedger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.mtoManage.CP_mtoLedger.models")
public class CpMtoLedgerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CpMtoLedgerApplication.class, args);
	}

}
