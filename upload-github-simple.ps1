# Script simples para upload APK no GitHub

Write-Host "=== UPLOAD APK PARA GITHUB ==="

# Detectar APK
$apkPath = "C:\Monopoly Express\public\downloads"
$latestApk = Get-ChildItem "$apkPath\MonopolyExpress-v*.apk" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (!$latestApk) {
    Write-Host "Erro: APK nao encontrado"
    exit 1
}

$apkName = $latestApk.Name
$apkSize = [math]::Round($latestApk.Length/1MB, 1)
$version = if ($apkName -match 'v(\d+\.\d+)') { $matches[1] } else { '4.1' }

Write-Host "APK: $apkName ($apkSize MB)"
Write-Host "Versao: v$version"
Write-Host ""

# URLs
$githubRepo = "AstridNielsen-lab/Monopoly-Express-Cooperative"
$releasesUrl = "https://github.com/$githubRepo/releases/new"

Write-Host "Abrindo GitHub Releases..."
Start-Process $releasesUrl

Write-Host "Abrindo pasta do APK..."
Start-Process $apkPath

Write-Host ""
Write-Host "PASSOS NO GITHUB:"
Write-Host "1. Tag version: v$version"
Write-Host "2. Release title: MonopolyExpress v$version - Download Direto"
Write-Host "3. Arraste o arquivo: $apkName"
Write-Host "4. Marque: Set as the latest release"
Write-Host "5. Clique: Publish release"
Write-Host ""

$description = @"
## MonopolyExpress v$version

### Novidades:
- Sistema de Mapa GPS Completo
- Notificacoes em tempo real
- Sistema de Avaliacoes
- Perfil Editavel
- Performance otimizada

### Download:
- Tamanho: ${apkSize}MB
- Compatibilidade: Android 7.0+
- Download direto mais rapido

Baixe agora e experimente!
"@

Write-Host "DESCRICAO DA RELEASE:"
Write-Host $description
Write-Host ""

Read-Host "Pressione Enter apos criar a release"

# Testar links
$downloadUrl = "https://github.com/$githubRepo/releases/download/v$version/$apkName"
Write-Host "Link GitHub: $downloadUrl"

if (Test-Path $latestApk.FullName) {
    Write-Host "Arquivo local: OK (${apkSize}MB)"
} else {
    Write-Host "Arquivo local: ERRO"
}

Write-Host ""
Write-Host "CONCLUIDO!"
Write-Host "APK disponivel em:"
Write-Host "  Local: /downloads/$apkName"
Write-Host "  GitHub: $downloadUrl"
Write-Host "  Site: http://localhost:5173"

