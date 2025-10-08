# Script para limpar a pasta dist de forma segura
# Uso: .\scripts\limpar-dist.ps1

Write-Host "[LIMPEZA] Iniciando limpeza da pasta dist..." -ForegroundColor Cyan

# 1. Tentar fechar processos do Electron
Write-Host "[PROCESSO] Verificando processos do Electron..." -ForegroundColor Yellow
$processos = Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.ProcessName -match "electron" -or 
    $_.ProcessName -match "EBD" -or 
    ($_.Path -and $_.Path -like "*EBD*")
}

if ($processos) {
    Write-Host "   Encontrados $($processos.Count) processo(s), finalizando..." -ForegroundColor Yellow
    $processos | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
} else {
    Write-Host "   [OK] Nenhum processo encontrado" -ForegroundColor Green
}

# 2. Fechar Windows Explorer (libera arquivos travados)
Write-Host "[EXPLORER] Reiniciando Windows Explorer..." -ForegroundColor Yellow
Stop-Process -Name "explorer" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Start-Process "explorer.exe"
Start-Sleep -Seconds 2

# 3. Tentar deletar com PowerShell
Write-Host "[DELETE] Tentando deletar com PowerShell..." -ForegroundColor Yellow
$distPath = Join-Path $PSScriptRoot "..\dist"
if (Test-Path $distPath) {
    Remove-Item -Path $distPath -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# 4. Se ainda existir, usar CMD
if (Test-Path $distPath) {
    Write-Host "[DELETE] Tentando deletar com CMD..." -ForegroundColor Yellow
    $projectRoot = Split-Path $PSScriptRoot -Parent
    cmd /c "cd /d `"$projectRoot`" && rmdir /s /q dist" 2>$null
    Start-Sleep -Seconds 1
}

# 5. Verificar resultado
if (Test-Path $distPath) {
    Write-Host "[ERRO] Nao foi possivel deletar completamente a pasta dist" -ForegroundColor Red
    Write-Host "   Tente fechar todos os programas e execute novamente" -ForegroundColor Red
    Write-Host "   Ou reinicie o computador se o problema persistir" -ForegroundColor Red
    exit 1
} else {
    Write-Host "[SUCESSO] Pasta dist deletada com sucesso!" -ForegroundColor Green
    exit 0
}
