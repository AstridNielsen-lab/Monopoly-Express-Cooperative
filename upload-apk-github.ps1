# Script para fazer upload do APK para GitHub Releases

Write-Host "==========================================" -ForegroundColor Green
Write-Host "   UPLOAD APK PARA GITHUB RELEASES      " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Detectar APK mais recente
$apkPath = "C:\Monopoly Express\public\downloads"
$latestApk = Get-ChildItem "$apkPath\MonopolyExpress-v*.apk" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (!$latestApk) {
    Write-Host "Erro: Nenhum APK encontrado em $apkPath" -ForegroundColor Red
    exit 1
}

$apkName = $latestApk.Name
$apkSize = [math]::Round($latestApk.Length/1MB, 1)
$version = if ($apkName -match 'v([\d\.]+)') { $matches[1] } else { '4.1' }

Write-Host "APK encontrado:" -ForegroundColor Green
Write-Host "   Nome: $apkName" -ForegroundColor White
Write-Host "   Versao: v$version" -ForegroundColor White
Write-Host "   Tamanho: ${apkSize}MB" -ForegroundColor White
Write-Host "   Caminho: $($latestApk.FullName)" -ForegroundColor White
Write-Host ""

# URLs do GitHub
$githubRepo = "AstridNielsen-lab/Monopoly-Express-Cooperative"
$releasesUrl = "https://github.com/$githubRepo/releases/new"
$tagsUrl = "https://github.com/$githubRepo/tags"

Write-Host "GitHub Info:" -ForegroundColor Cyan
Write-Host "   Repositorio: $githubRepo" -ForegroundColor White
Write-Host "   Releases: $releasesUrl" -ForegroundColor White
Write-Host ""

# Verificar se Git esta configurado
try {
    $gitStatus = git status 2>$null
    Write-Host "Git Status: OK" -ForegroundColor Green
} catch {
    Write-Host "Aviso: Git nao configurado ou nao e um repositorio" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "PASSOS PARA CRIAR RELEASE NO GITHUB:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abrindo GitHub Releases..." -ForegroundColor White
Start-Process $releasesUrl

Write-Host "2. Abrindo pasta do APK..." -ForegroundColor White
Start-Process $apkPath

Write-Host ""
Write-Host "3. No GitHub, preencha:" -ForegroundColor White
Write-Host "   Tag version: v$version" -ForegroundColor Gray
Write-Host "   Release title: MonopolyExpress v$version - Download Direto" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Descricao da Release (copie e cole):" -ForegroundColor White
Write-Host "" -ForegroundColor White

$releaseDescription = @"
## 📱 MonopolyExpress v$version - Versao Atual

### ✨ Novidades desta versao:

🗺️ **Sistema de Mapa GPS Completo**
- Localizacao em tempo real dos motoboys
- Integracao com OpenStreetMap + Leaflet.js
- Rotas otimizadas para entregas

🔔 **Sistema de Notificacoes**
- Notificacoes locais para novas entregas
- Alertas de status em tempo real
- Comunicacao instantanea

⭐ **Sistema de Avaliacoes**
- Avaliacao de motoboys de 1 a 5 estrelas
- Historico de avaliacoes
- Melhoria continua do servico

👤 **Perfil Editavel**
- Dados pessoais atualizaveis
- Configuracoes personalizadas
- Gestao de preferencias

### 📱 Download do APK:

- **Tamanho:** ${apkSize}MB
- **Compatibilidade:** Android 7.0+ (API 24)
- **Permissoes:** GPS/Localizacao, Internet
- **Instalacao:** Direto do APK

### 🔧 Melhorias:

- ✅ Performance otimizada
- ✅ Interface mais fluida
- ✅ Bugs corrigidos
- ✅ Estabilidade melhorada
- ✅ Download direto mais rapido

### 🌐 Site Atualizado:

- Download direto do servidor
- Design moderno e responsivo
- Documentacao completa

---

**🚀 Baixe agora e experimente todas as novidades!**

> ⚠️ **Importante:** Desinstale versoes anteriores antes de instalar esta versao.
"@

Write-Host $releaseDescription -ForegroundColor White
Write-Host ""

Write-Host "5. Upload do APK:" -ForegroundColor White
Write-Host "   📎 Arraste o arquivo $apkName ou clique 'Attach binaries'" -ForegroundColor Gray
Write-Host ""

Write-Host "6. Configuracoes:" -ForegroundColor White
Write-Host "   ✅ Marcar 'Set as the latest release'" -ForegroundColor Gray
Write-Host "   ✅ Opcional: 'Create a discussion for this release'" -ForegroundColor Gray
Write-Host ""

Write-Host "7. Clique em 'Publish release'" -ForegroundColor White
Write-Host ""

Read-Host "Pressione Enter apos criar a release para continuar"

# Testar o link de download do GitHub
Write-Host ""
Write-Host "Testando link de download do GitHub..." -ForegroundColor Cyan
$downloadUrl = "https://github.com/$githubRepo/releases/download/v$version/$apkName"
Write-Host "   Link: $downloadUrl" -ForegroundColor White

try {
    $response = Invoke-WebRequest -Uri $downloadUrl -Method Head -ErrorAction Stop
    Write-Host "✅ Link do GitHub funcionando! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⏳ Link ainda nao disponivel (normal, pode demorar alguns minutos)" -ForegroundColor Yellow
}

# Testar link local
Write-Host ""
Write-Host "Testando link local..." -ForegroundColor Cyan
if (Test-Path $latestApk.FullName) {
    Write-Host "✅ Arquivo local OK: ${apkSize}MB" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo local nao encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 PROCESSO CONCLUIDO!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 APK disponivel em:" -ForegroundColor Cyan
Write-Host "   Local: /downloads/$apkName" -ForegroundColor White
Write-Host "   GitHub: $downloadUrl" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Visite: http://localhost:5173 para testar" -ForegroundColor Cyan

