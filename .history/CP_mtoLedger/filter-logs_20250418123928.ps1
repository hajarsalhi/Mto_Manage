# PowerShell script to filter Spring Boot logs
param(
    [switch]$ShowAll,
    [switch]$ShowInfo,
    [switch]$ShowError,
    [switch]$ShowWarn,
    [switch]$ShowDebug,
    [switch]$ShowScheduler
)

# Set default filters if none specified
if (-not ($ShowAll -or $ShowInfo -or $ShowError -or $ShowWarn -or $ShowDebug -or $ShowScheduler)) {
    $ShowInfo = $true
    $ShowError = $true
    $ShowWarn = $true
    $ShowScheduler = $true
}

# Build the filter pattern
$filterPattern = @()
if ($ShowAll) {
    $filterPattern = @(".*")
} else {
    if ($ShowInfo) { $filterPattern += "INFO" }
    if ($ShowError) { $filterPattern += "ERROR" }
    if ($ShowWarn) { $filterPattern += "WARN" }
    if ($ShowDebug) { $filterPattern += "DEBUG" }
    if ($ShowScheduler) { 
        $filterPattern += "Start Current Balance"
        $filterPattern += "Finish setBalanceRealTime"
        $filterPattern += "Bank deposit products"
        $filterPattern += "Found .* products to process"
        $filterPattern += "Last transaction date"
    }
}

# Create a regex pattern from the filters
$regexPattern = "(" + ($filterPattern -join "|") + ")"

Write-Host "Starting Spring Boot application with log filtering..."
Write-Host "Press Ctrl+C to stop the application"
Write-Host ""

# Run the application and filter the output
.\mvnw.cmd spring-boot:run | ForEach-Object {
    if ($_ -match $regexPattern) {
        Write-Host $_
    }
} 