# Script para atualizar automaticamente todos os links de download do APK
# para sempre apontar para a versão mais recente

Write-Host "========================================" -ForegroundColor Green
Write-Host "   ATUALIZANDO LINKS DO APK MONOPOLY   " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Detectar a versão mais recente automaticamente
$apkPath = "C:\Monopoly Express\CooperativaMotoboy"
$latestApk = Get-ChildItem "$apkPath\CooperativaMotoboy-v*.apk" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (!$latestApk) {
    Write-Host "❌ Nenhum APK encontrado em $apkPath" -ForegroundColor Red
    exit 1
}

# Extrair informações da versão mais recente
$apkName = $latestApk.Name
$apkSize = [math]::Round($latestApk.Length/1MB, 1)
$version = if ($apkName -match 'v(\d+\.\d+)') { $matches[1] } else { 'unknown' }

Write-Host "✅ APK mais recente detectado:" -ForegroundColor Green
Write-Host "   Nome: $apkName" -ForegroundColor White
Write-Host "   Versão: v$version" -ForegroundColor White
Write-Host "   Tamanho: ${apkSize}MB" -ForegroundColor White
Write-Host ""

# URLs que serão atualizadas
$githubRepo = "AstridNielsen-lab/Monopoly-Express-Cooperative"
$latestDownloadUrl = "https://github.com/$githubRepo/releases/latest/download/$apkName"
$releasesUrl = "https://github.com/$githubRepo/releases"

Write-Host "🔗 URLs atualizadas:" -ForegroundColor Cyan
Write-Host "   Download: $latestDownloadUrl" -ForegroundColor White
Write-Host "   Releases: $releasesUrl" -ForegroundColor White
Write-Host ""

# Lista de arquivos para atualizar
$filesToUpdate = @(
    "src\components\home\MobileApp.tsx",
    "README.md",
    "INSTRUCOES_FINAIS.md"
)

$updatedFiles = 0

foreach ($file in $filesToUpdate) {
    $fullPath = "C:\Monopoly Express\$file"
    
    if (Test-Path $fullPath) {
        Write-Host "📝 Atualizando: $file" -ForegroundColor Yellow
        
        $content = Get-Content $fullPath -Raw
        $originalContent = $content
        
        # Atualizar URLs de download do GitHub (versões específicas para latest)
        $content = $content -replace 'https://github.com/[^/]+/[^/]+/releases/download/v[\d\.]+/[^"\s]+\.apk', $latestDownloadUrl
        
        # Atualizar versão nos textos
        $content = $content -replace 'v[\d\.]+\s*\([\d\.,]+MB\)', "v$version (${apkSize}MB)"
        
        # Atualizar tamanhos independentes
        $content = $content -replace '[\d\.,]+\s*MB', "${apkSize}MB"
        
        # Verificar se houve mudanças
        if ($content -ne $originalContent) {
            Set-Content $fullPath $content -Encoding UTF8
            Write-Host "   ✅ Arquivo atualizado com sucesso" -ForegroundColor Green
            $updatedFiles++
        } else {
            Write-Host "   ℹ️  Nenhuma alteração necessária" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ Arquivo não encontrado: $fullPath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📊 RESUMO DA ATUALIZAÇÃO:" -ForegroundColor Cyan
Write-Host "   Arquivos verificados: $($filesToUpdate.Count)" -ForegroundColor White
Write-Host "   Arquivos atualizados: $updatedFiles" -ForegroundColor White
Write-Host "   Versão configurada: v$version" -ForegroundColor White
Write-Host "   Tamanho configurado: ${apkSize}MB" -ForegroundColor White
Write-Host ""

if ($updatedFiles -gt 0) {
    Write-Host "✅ Links atualizados com sucesso!" -ForegroundColor Green
    Write-Host "💡 Agora todos os botões baixam a versão mais recente automaticamente" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  Todos os links já estavam atualizados" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🔗 Para testar os links:" -ForegroundColor Cyan
Write-Host "   1. Certifique-se que a release v$version existe no GitHub" -ForegroundColor White
Write-Host "   2. Teste o link: $latestDownloadUrl" -ForegroundColor White
Write-Host "   3. Execute o site: npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Script concluído!" -ForegroundColor Green

