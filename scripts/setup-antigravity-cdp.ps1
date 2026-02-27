<#
.SYNOPSIS
Antigravity CDP (Chrome DevTools Protocol) 9000 포트 강제 주입 스크립트
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# 1. Config 분리 (하드코딩 제거)
$Script:Config = @{
    TargetExeName = "Antigravity*"
    TargetPort    = 9000
    SearchPaths   = @(
        [Environment]::GetFolderPath('Desktop'),
        "$env:USERPROFILE\Desktop",
        "$env:USERPROFILE\OneDrive\Desktop",
        "$env:APPDATA\Microsoft\Windows\Start Menu\Programs",
        "$env:ProgramData\Microsoft\Windows\Start Menu\Programs",
        "$env:USERPROFILE\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar"
    )
}

# 2. 순수 함수: 탐색 모듈
function Get-TargetShortcuts {
    param ([array]$Paths)
    
    $results = @()
    foreach ($path in $Paths) {
        if (Test-Path $path) {
            $results += Get-ChildItem -Path $path -Recurse -Filter "*.lnk" -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like $Script:Config.TargetExeName }
        }
    }
    return $results | Select-Object -Unique # 중복 제거
}

# 3. 조작 모듈 (불변성 유지 및 상태 검증)
function Update-ShortcutArguments {
    param ([string]$ShortcutPath, [string]$Port)
    
    $wshShell = New-Object -ComObject WScript.Shell
    $shortcut = $wshShell.CreateShortcut($ShortcutPath)
    $args = $shortcut.Arguments
    $targetArg = "--remote-debugging-port=$Port"

    if ($args -notmatch "--remote-debugging-port=\d+") {
        $shortcut.Arguments = "$targetArg $args".Trim()
        $shortcut.Save()
        Write-Host "Injected Port $Port to: $ShortcutPath" -ForegroundColor Green
    }
    elseif ($args -notmatch $targetArg) {
        $shortcut.Arguments = $args -replace "--remote-debugging-port=\d+", $targetArg
        $shortcut.Save()
        Write-Host "Updated Port to $Port in: $ShortcutPath" -ForegroundColor Green
    }
    else {
        Write-Host "Port $Port already exists in: $ShortcutPath" -ForegroundColor Yellow
    }
}

# 4. 실행 파이프라인
function Invoke-CDPInjection {
    Write-Host "Initiating Antigravity CDP Port Injection..." -ForegroundColor Cyan
    
    $exceptions = @()
    try {
        $shortcuts = @(Get-TargetShortcuts -Paths $Script:Config.SearchPaths)
        
        if ($shortcuts.Count -eq 0) {
            Write-Host "No shortcuts found. Attempting to create from local app data..." -ForegroundColor Yellow
            $exePath = "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe"
            
            if (Test-Path $exePath) {
                $desktopPath = [Environment]::GetFolderPath('Desktop')
                $shortcutPath = "$desktopPath\Antigravity.lnk"
                $wshShell = New-Object -ComObject WScript.Shell
                $shortcut = $wshShell.CreateShortcut($shortcutPath)
                $shortcut.TargetPath = $exePath
                $shortcut.Arguments = "--remote-debugging-port=$($Script:Config.TargetPort)"
                $shortcut.Save()
                Write-Host "Created new shortcut and injected port: $shortcutPath" -ForegroundColor Green
            }
            else {
                throw "Antigravity.exe not found in local app data. Please install Antigravity first."
            }
        }
        else {
            $shortcuts | ForEach-Object {
                Update-ShortcutArguments -ShortcutPath $_.FullName -Port $Script:Config.TargetPort
            }
        }
        
        Write-Host "Sequence Complete. Restart Antigravity." -ForegroundColor Cyan
    }
    catch {
        Write-Error "Fatal Error during CDP Injection: $_"
        exit 1
    }
}

Invoke-CDPInjection
