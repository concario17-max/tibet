# === Antigravity Force Reset & CDP Bind ===
Write-Host "Killing all Antigravity processes..." -ForegroundColor Red
taskkill /F /IM Antigravity.exe /T

Start-Sleep -Seconds 2

Write-Host "Updating all shortcuts to use standard CDP port 9222..." -ForegroundColor Yellow
$searchLocations = @(
    [Environment]::GetFolderPath('Desktop'),
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\OneDrive\Desktop",
    "$env:APPDATA\Microsoft\Windows\Start Menu\Programs",
    "$env:ProgramData\Microsoft\Windows\Start Menu\Programs",
    "$env:USERPROFILE\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar"
)

$WshShell = New-Object -ComObject WScript.Shell
$foundShortcuts = @()

foreach ($location in $searchLocations) {
    if (Test-Path $location) {
        $shortcuts = Get-ChildItem -Path $location -Recurse -Filter "*.lnk" -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "*Antigravity*" }
        $foundShortcuts += $shortcuts
    }
}

foreach ($shortcutFile in $foundShortcuts) {
    $shortcut = $WshShell.CreateShortcut($shortcutFile.FullName)
    $originalArgs = $shortcut.Arguments
    
    # Remove any old debugging flags
    $cleanArgs = $originalArgs -replace "--remote-debugging-port=\d+", ""
    $shortcut.Arguments = "--remote-debugging-port=9222 " + $cleanArgs.Trim()
    $shortcut.Save()
    Write-Host "Updated: $($shortcutFile.FullName)" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Process Complete ===" -ForegroundColor Cyan
Write-Host "ALL INSTANCES KILLED. Now manually launch Antigravity using a shortcut." -ForegroundColor Magenta
Write-Host "Then check port 9222."
