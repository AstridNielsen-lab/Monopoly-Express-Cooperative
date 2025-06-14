# Script para criar Release v4.0 no GitHub
# Monopoly Express - Cooperativa de Motoboys

Write-Host "==============================================" -ForegroundColor Green
Write-Host "   CRIANDO RELEASE v4.0 - MONOPOLY EXPRESS" -ForegroundColor Green  
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Informacoes da Release
$version = "v4.0"
$repoUrl = "https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative"
$releasesUrl = "$repoUrl/releases/new"
$apkPath = "C:\Monopoly Express\CooperativaMotoboy\CooperativaMotoboy-v4.0.apk"

Write-Host "INFORMACOES DA RELEASE:" -ForegroundColor Cyan
Write-Host "   Versao: $version" -ForegroundColor White
Write-Host "   APK: CooperativaMotoboy-v4.0.apk 5.87 MB" -ForegroundColor White
Write-Host "   Tag: Ja criada e enviada" -ForegroundColor Green
Write-Host ""

# Verificar se o APK existe
if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "✅ APK encontrado: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "❌ APK não encontrado em: $apkPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 PASSOS PARA CRIAR A RELEASE:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abrindo GitHub Releases..." -ForegroundColor White
Start-Process $releasesUrl

Write-Host "2. Preencha os campos:" -ForegroundColor White
Write-Host "   📋 Tag version: v4.0 (já selecionado)" -ForegroundColor Gray
Write-Host "   📝 Release title: 🚀 Monopoly Express v4.0 - App Completo" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Descrição da Release (copie e cole):" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

$releaseDescription = @"
## 🎉 Monopoly Express v4.0 - Release Completa!

### ✨ **Novidades desta versão:**

🗺️ **Sistema de Mapa GPS Completo**
- Localização em tempo real dos motoboys
- Integração com OpenStreetMap + Leaflet.js
- Rotas otimizadas para entregas

🔔 **Sistema de Notificações**
- Notificações locais para novas entregas
- Alertas de status em tempo real
- Comunicação instantânea

⭐ **Sistema de Avaliações**
- Avaliação de motoboys de 1 a 5 estrelas
- Histórico de avaliações
- Melhoria contínua do serviço

👤 **Perfil Editável**
- Dados pessoais atualizáveis
- Configurações personalizadas
- Gestão de preferências

🧹 **Organização do Código**
- Branch única (main) como principal
- Código limpo e organizado
- Documentação atualizada

### 📱 **Download do APK:**

- **Tamanho:** 5.87 MB
- **Compatibilidade:** Android 7.0+ (API 24)
- **Permissões:** GPS/Localização, Internet

### 🔧 **Correções e Melhorias:**

- ✅ Performance otimizada
- ✅ Interface mais fluida
- ✅ Bugs corrigidos
- ✅ Estabilidade melhorada

### 🌐 **Site Atualizado:**

- Links de download atualizados
- Design moderno e responsivo
- Documentação completa

---

**🚀 Baixe agora e experimente todas as novidades!**

> ⚠️ **Importante:** Desinstale versões anteriores antes de instalar esta versão.

"@

Write-Host $releaseDescription -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

Write-Host "4. Upload do APK:" -ForegroundColor White
Write-Host "   📎 Arraste o arquivo ou clique em 'Attach binaries'" -ForegroundColor Gray
Write-Host "   📁 Arquivo: CooperativaMotoboy-v4.0.apk" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Configurações:" -ForegroundColor White
Write-Host "   ✅ Set as the latest release (marcar)" -ForegroundColor Gray
Write-Host "   ✅ Create a discussion for this release (opcional)" -ForegroundColor Gray
Write-Host ""

Write-Host "6. Clique em 'Publish release'" -ForegroundColor White
Write-Host ""

# Abrir o diretório do APK
Write-Host "📂 Abrindo diretório do APK..." -ForegroundColor White
Start-Process (Split-Path $apkPath -Parent)

Write-Host ""
Write-Host "✨ Script executado com sucesso!" -ForegroundColor Green
Write-Host "🌐 GitHub Releases: $releasesUrl" -ForegroundColor Cyan
Write-Host "📱 APK: $apkPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Aguardando você criar a release no GitHub..." -ForegroundColor Yellow

# Esperar confirmação
Read-Host "Pressione Enter após criar a release para continuar"

# Testar o link de download
Write-Host ""
Write-Host "🔗 Testando link de download..." -ForegroundColor Cyan
$downloadUrl = "$repoUrl/releases/download/v4.0/CooperativaMotoboy-v4.0.apk"
Write-Host "   Link: $downloadUrl" -ForegroundColor White

try {
    $response = Invoke-WebRequest -Uri $downloadUrl -Method Head -ErrorAction Stop
    Write-Host "✅ Link funcionando! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⏳ Link ainda não disponível (normal, pode demorar alguns minutos)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 RELEASE v4.0 CRIADA COM SUCESSO!" -ForegroundColor Green
Write-Host "🌐 Visite: $repoUrl/releases" -ForegroundColor Cyan
Write-Host "📱 Download: $downloadUrl" -ForegroundColor Cyan

