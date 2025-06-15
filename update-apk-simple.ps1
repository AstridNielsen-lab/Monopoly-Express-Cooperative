# Script simples para atualizar links do APK

Write-Host "Atualizando links do APK para versao mais recente..."

# Detectar APK mais recente
$apkPath = "C:\Monopoly Express\CooperativaMotoboy"
$latestApk = Get-ChildItem "$apkPath\CooperativaMotoboy-v*.apk" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (!$latestApk) {
    Write-Host "Erro: Nenhum APK encontrado"
    exit 1
}

$apkName = $latestApk.Name
$apkSize = [math]::Round($latestApk.Length/1MB, 1)
$version = if ($apkName -match 'v([\d\.]+)') { $matches[1] } else { '4.0' }

Write-Host "APK encontrado: $apkName ($apkSize MB)"
Write-Host "Versao: v$version"

# Novo URL
$newUrl = "https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative/releases/latest/download/$apkName"
Write-Host "Novo URL: $newUrl"

# Atualizar MobileApp.tsx
$mobileAppFile = "C:\Monopoly Express\src\components\home\MobileApp.tsx"
if (Test-Path $mobileAppFile) {
    $content = Get-Content $mobileAppFile -Raw
    
    # Substituir URL antigo
    $content = $content -replace 'href="https://github.com/[^"]*\.apk"', "href=`"$newUrl`""
    
    # Substituir tamanho
    $content = $content -replace 'Baixar APK v[\d\.]+ \([\d\.,]+MB\)', "Baixar APK v$version (${apkSize}MB)"
    
    Set-Content $mobileAppFile $content
    Write-Host "MobileApp.tsx atualizado"
}

Write-Host "Atualizacao concluida!"
Write-Host "Agora todos os botoes baixam a versao mais recente automaticamente."

