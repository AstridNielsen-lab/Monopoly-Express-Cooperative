# Script para iniciar o desenvolvimento completo do Monopoly Express
# Execute com: .\start-dev.ps1

Write-Host "🚀 INICIANDO MONOPOLY EXPRESS - DESENVOLVIMENTO COMPLETO" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Verificar se as dependências estão instaladas
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependências instaladas!" -ForegroundColor Green
}

# Verificar se o arquivo .env existe
if (!(Test-Path ".env")) {
    Write-Host "⚠️ Arquivo .env não encontrado!" -ForegroundColor Yellow
    Write-Host "📄 Copiando .env.example para .env..." -ForegroundColor Blue
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
    Write-Host "💡 Configure as variáveis no arquivo .env conforme necessário" -ForegroundColor Cyan
}

# Testar conexão com backend
Write-Host "\n🔍 Testando backend..." -ForegroundColor Blue

# Iniciar backend em background
Write-Host "🔧 Iniciando backend..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "powershell" -ArgumentList "-Command", "npm run backend" -PassThru -WindowStyle Minimized

Start-Sleep -Seconds 5

# Testar se backend está rodando
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend está rodando!" -ForegroundColor Green
    Write-Host "📍 Backend: http://localhost:3001" -ForegroundColor Blue
} catch {
    Write-Host "❌ Backend não está respondendo!" -ForegroundColor Red
    Write-Host "💡 Verifique os logs do backend" -ForegroundColor Yellow
}

# Aguardar um pouco mais para o backend se estabilizar
Start-Sleep -Seconds 2

# Executar teste de integração
Write-Host "\n🧪 Executando teste de integração..." -ForegroundColor Blue
try {
    node test-frontend-backend.js
    Write-Host "✅ Teste de integração concluído!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Teste de integração falhou, mas continuando..." -ForegroundColor Yellow
}

# Iniciar frontend
Write-Host "\n🎨 Iniciando frontend..." -ForegroundColor Magenta
Write-Host "📍 Frontend será aberto em: http://localhost:5173" -ForegroundColor Blue
Write-Host "\n🎉 SISTEMA PRONTO!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "\n💡 DICAS IMPORTANTES:" -ForegroundColor Cyan
Write-Host "   • Backend rodando em segundo plano" -ForegroundColor White
Write-Host "   • Frontend abrirá em uma nova janela" -ForegroundColor White
Write-Host "   • Console do navegador mostra logs das APIs" -ForegroundColor White
Write-Host "   • Ctrl+C para parar o frontend" -ForegroundColor White
Write-Host "   • Backend continuará rodando" -ForegroundColor White
Write-Host "\n🔗 LINKS ÚTEIS:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Blue
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Blue
Write-Host "   API Docs: http://localhost:3001/api/health" -ForegroundColor Blue
Write-Host "\n📱 TESTE O SISTEMA:" -ForegroundColor Green
Write-Host "   1. Registre um usuário" -ForegroundColor White
Write-Host "   2. Faça login" -ForegroundColor White
Write-Host "   3. Crie uma entrega" -ForegroundColor White
Write-Host "   4. Teste a assinatura premium" -ForegroundColor White
Write-Host "\n" -ForegroundColor White

# Iniciar frontend (irá abrir no navegador)
npm run dev

# Cleanup quando o frontend for fechado
Write-Host "\n🧹 Limpando processos..." -ForegroundColor Yellow
if ($backend -and !$backend.HasExited) {
    Write-Host "🔴 Parando backend..." -ForegroundColor Red
    Stop-Process -Id $backend.Id -Force
    Write-Host "✅ Backend parado!" -ForegroundColor Green
}

Write-Host "\n👋 Desenvolvimento encerrado!" -ForegroundColor Cyan

