@echo off
echo Starting Spring Boot application with log filtering...
echo Press Ctrl+C to stop the application

cd %~dp0
.\mvnw.cmd spring-boot:run | findstr /C:"INFO" /C:"ERROR" /C:"WARN" /C:"DEBUG" /C:"Start Current Balance" /C:"Finish setBalanceRealTime" 