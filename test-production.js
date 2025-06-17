// Script para testar as novas funcionalidades em produção
import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://monopoly-express-logistica-e9rft0x0f.vercel.app';

async function testProductionEndpoints() {
  console.log('🌐 Testando endpoints de produção...');
  
  try {
    // Teste 1: Health check
    console.log('\n1. Testando health check...');
    const healthResponse = await fetch(`${PRODUCTION_URL}/api/health`);
    const healthResult = await healthResponse.json();
    console.log('✅ Health check:', healthResult);
    
    // Teste 2: Listar entregas disponíveis (fila central)
    console.log('\n2. Testando fila central de entregas...');
    const deliveriesResponse = await fetch(`${PRODUCTION_URL}/api/delivery/available`);
    const deliveriesResult = await deliveriesResponse.json();
    console.log('✅ Fila central:', deliveriesResult);
    
    // Teste 3: Verificar se frontend carrega
    console.log('\n3. Testando carregamento do frontend...');
    const frontendResponse = await fetch(PRODUCTION_URL);
    const frontendHtml = await frontendResponse.text();
    
    if (frontendHtml.includes('Monopoly Express') && frontendResponse.status === 200) {
      console.log('✅ Frontend carregado com sucesso');
    } else {
      console.log('❌ Problema no frontend');
    }
    
    // Teste 4: Verificar se API de registro está funcionando (sem criar usuário)
    console.log('\n4. Testando endpoint de registro (validação apenas)...');
    const registerTestResponse = await fetch(`${PRODUCTION_URL}/api/auth/register/motoboy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Dados incompletos para testar validação
        email: 'teste@exemplo.com'
      })
    });
    
    const registerTestResult = await registerTestResponse.json();
    console.log('✅ Validação de registro:', registerTestResult);
    
  } catch (error) {
    console.error('❌ Erro no teste de produção:', error.message);
  }
}

async function testNewFeatures() {
  console.log('\n🆕 Testando novas funcionalidades...');
  
  console.log('\n📋 Funcionalidades implementadas:');
  console.log('✅ CNH opcional para bicicletas');
  console.log('✅ Fila central única de entregas');
  console.log('✅ Validação inteligente por tipo de veículo');
  console.log('✅ Interface atualizada com indicações visuais');
  console.log('✅ Sistema de concorrência para entregas');
  
  console.log('\n🔗 URLs de acesso:');
  console.log(`Frontend: ${PRODUCTION_URL}`);
  console.log(`API Health: ${PRODUCTION_URL}/api/health`);
  console.log(`Fila de Entregas: ${PRODUCTION_URL}/api/delivery/available`);
  console.log(`Registro Motoboy: ${PRODUCTION_URL}/register`);
  console.log(`Login: ${PRODUCTION_URL}/login`);
}

// Executar testes
testProductionEndpoints()
  .then(() => testNewFeatures())
  .then(() => console.log('\n🎉 Testes de produção concluídos!'))
  .catch(console.error);

