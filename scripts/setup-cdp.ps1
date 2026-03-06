<#
.SYNOPSIS
    Antigravity CDP (Chrome DevTools Protocol) Setup Script
.DESCRIPTION
    Systematically locates all Antigravity shortcuts and injects the CDP debugging port flag.
    Engineered with strict error handling, robust pathing, and premium CLI feedback.
.NOTES
    Author: Ray
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-PremiumLog {
    param (
        [string]$Message,
        [string]$Type = "INFO"
    )
    switch ($Type) {
        "INFO" { Write-Host "[+] $Message" -ForegroundColor Cyan }
        "SUCCESS" { Write-Host "[√] $Message" -ForegroundColor Green }
        "WARNING" { Write-Host "[!] $Message" -ForegroundColor Yellow }
        "ERROR" { Write-Host "[X] $Message" -ForegroundColor Red }
        "DEBUG" { Write-Host "[-] $Message" -ForegroundColor DarkGray }
    }
}

Write-PremiumLog "Initializing Antigravity CDP Configuration..." "INFO"

try {
    # 1. Define Robust Search Locations
    $searchLocations = @(
        [System.Environment]::GetFolderPath('DesktopDirectory'),
        [System.Environment]::GetFolderPath('CommonDesktopDirectory'),
        [System.Environment]::GetFolderPath('Programs'),
        [System.Environment]::GetFolderPath('CommonPrograms'),
        "$env:APPDATA\Microsoft\Windows\Start Menu\Programs",
        "$env:USERPROFILE\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar"
    ) | Select-Object -Unique

    $WshShell = New-Object -ComObject WScript.Shell
    $foundShortcuts = @()

    # 2. Advanced Shortcut Scanning
    foreach ($location in $searchLocations) {
        if (Test-Path -Path $location -PathType Container) {
            Write-PremiumLog "Scanning territory: $location" "DEBUG"
            try {
                $shortcuts = Get-ChildItem -Path $location -Recurse -Filter "*.lnk" -ErrorAction SilentlyContinue |
                Where-Object { $_.Name -match "Antigravity" }
                if ($shortcuts) { $foundShortcuts += $shortcuts }
            }
            catch {
                Write-PremiumLog "Access denied or read error in: $location" "WARNING"
            }
        }
    }

    # 3. Payload Injection & Shortcut Construction
    if ($foundShortcuts.Count -eq 0) {
        Write-PremiumLog "Zero existing shortcuts detected. Initiating fallback executable search..." "WARNING"
        $exePath = Join-Path $env:LOCALAPPDATA "Programs\Antigravity\Antigravity.exe"

        if (Test-Path -Path $exePath -PathType Leaf) {
            $desktopPath = [System.Environment]::GetFolderPath('DesktopDirectory')
            $shortcutPath = Join-Path $desktopPath "Antigravity.lnk"
            
            $shortcut = $WshShell.CreateShortcut($shortcutPath)
            $shortcut.TargetPath = $exePath
            $shortcut.Arguments = "--remote-debugging-port=9000"
            $shortcut.Save()
            Write-PremiumLog "Fresh shortcut minted at: $shortcutPath" "SUCCESS"
        }
        else {
            throw "Antigravity.exe not found in standard installation paths."
        }
    }
    else {
        Write-PremiumLog "Identified $($foundShortcuts.Count) target shortcut(s)." "SUCCESS"
        
        foreach ($shortcutFile in $foundShortcuts) {
            $shortcut = $WshShell.CreateShortcut($shortcutFile.FullName)
            $originalArgs = $shortcut.Arguments

            if ($originalArgs -match "--remote-debugging-port=\d+") {
                $shortcut.Arguments = $originalArgs -replace "--remote-debugging-port=\d+", "--remote-debugging-port=9000"
                Write-PremiumLog "Updated existing CDP port in: $($shortcutFile.Name)" "INFO"
            }
            else {
                $shortcut.Arguments = "--remote-debugging-port=9000 " + $originalArgs
                Write-PremiumLog "Injected CDP port into: $($shortcutFile.Name)" "SUCCESS"
            }
            $shortcut.Save()
        }
    }

    Write-PremiumLog "CDP Injection Sequence Complete. Full restart of Antigravity required." "INFO"

}
catch {
    Write-PremiumLog "CRITICAL FAILURE: $_" "ERROR"
    exit 1
}
finally {
    # Cleanup COM object
    if ($WshShell) {
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($WshShell) | Out-Null
        [System.GC]::Collect()
        [System.GC]::WaitForPendingFinalizers()
    }
}
