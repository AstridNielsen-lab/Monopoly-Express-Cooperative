# Script simples para criar Release v4.0

Write-Host "=== CRIANDO RELEASE v4.0 ==="

# Verificar APK
$apkPath = "C:\Monopoly Express\CooperativaMotoboy\CooperativaMotoboy-v4.0.apk"
if (Test-Path $apkPath) {
    Write-Host "APK encontrado!"
} else {
    Write-Host "ERRO: APK nao encontrado!"
    exit 1
}

# Abrir GitHub Releases
$releasesUrl = "https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative/releases/new"
Write-Host "Abrindo GitHub Releases..."
Start-Process $releasesUrl

# Abrir pasta do APK  
Write-Host "Abrindo pasta do APK..."
Start-Process "C:\Monopoly Express\CooperativaMotoboy"

Write-Host ""
Write-Host "PASSOS:"
Write-Host "1. Tag version: v4.0"
Write-Host "2. Release title: Monopoly Express v4.0 - App Completo"
Write-Host "3. Arraste o arquivo CooperativaMotoboy-v4.0.apk"
Write-Host "4. Marque 'Set as the latest release'"
Write-Host "5. Clique 'Publish release'"
Write-Host ""

# Descricao da release
$description = @"
## Monopoly Express v4.0 - Release Completa!

### Novidades:
- Sistema de Mapa GPS Completo
- Localizacao em tempo real
- Sistema de Notificacoes
- Sistema de Avaliacoes (1-5 estrelas)
- Perfil Editavel
- Codigo organizado

### Download:
- Tamanho: 5.87 MB
- Compatibilidade: Android 7.0+
- Permissoes: GPS, Internet

### Melhorias:
- Performance otimizada
- Interface mais fluida
- Bugs corrigidos
- Estabilidade melhorada

Baixe agora e experimente!
"@

Write-Host "DESCRICAO DA RELEASE:"
Write-Host $description
Write-Host ""

Write-Host "Script concluido! Crie a release no GitHub."

