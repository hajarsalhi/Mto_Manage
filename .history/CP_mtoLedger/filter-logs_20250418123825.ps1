# PowerShell script to filter Spring Boot logs
$process = Start-Process -FilePath ".\mvnw.cmd" -ArgumentList "spring-boot:run" -NoNewWindow -PassThru -RedirectStandardOutput ".\spring-boot-output.log" -RedirectStandardError ".\spring-boot-error.log"

# Start a background job to monitor the log file
$job = Start-Job -ScriptBlock {
    param($logFile)
    
    # Create a file system watcher to monitor the log file
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = (Split-Path -Parent $logFile)
    $watcher.Filter = (Split-Path -Leaf $logFile)
    $watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite
    
    # Register the event handler
    $action = {
        $content = Get-Content -Path $event.SourceEventArgs.FullPath -Tail 10
        $content | Where-Object { $_ -match "^(INFO|ERROR|WARN|DEBUG)" } | ForEach-Object { Write-Host $_ }
    }
    
    $handler = Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action
    
    # Keep the job running
    while ($true) {
        Start-Sleep -Seconds 1
    }
} -ArgumentList ".\spring-boot-output.log"

# Wait for the process to complete
$process.WaitForExit()

# Clean up
Stop-Job -Job $job
Remove-Job -Job $job 