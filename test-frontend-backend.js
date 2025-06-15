// Script para testar a integração frontend-backend
// Execute com: node test-frontend-backend.js

const API_BASE_URL = 'http://localhost:3001/api';

// Função para fazer requisições HTTP
async function makeRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(`\n${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return { success: response.ok, data: result, status: response.status };
  } catch (error) {
    console.error(`Erro em ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function testIntegration() {
  console.log('🔗 TESTANDO INTEGRAÇÃO FRONTEND-BACKEND');
  console.log('=' + '='.repeat(50));
  
  // 1. Health Check
  console.log('\n1. 🏥 Health Check');
  const health = await makeRequest('/health');
  
  if (!health.success) {
    console.error('❌ Backend não está respondendo! Certifique-se que o servidor está rodando.');
    console.log('\n💡 Para iniciar o backend, execute: npm run backend');
    return;
  }
  
  // 2. Teste de Registro de Usuário
  console.log('\n2. 👤 Teste de Registro de Usuário');
  const userEmail = `teste.frontend.${Date.now()}@example.com`;
  const userRegister = await makeRequest('/auth/register/user', 'POST', {
    email: userEmail,
    password: '123456',
    name: 'Usuario Frontend Teste',
    phone: '(11) 99999-9999'
  });
  
  // 3. Teste de Login
  if (userRegister.success) {
    console.log('\n3. 🔐 Teste de Login');
    const userLogin = await makeRequest('/auth/login', 'POST', {
      email: userEmail,
      password: '123456',
      userType: 'user'
    });
  }
  
  // 4. Teste de Cálculo de Frete
  console.log('\n4. 💰 Teste de Cálculo de Frete');
  const freightTest = await makeRequest('/delivery/calculate-freight', 'POST', {
    pickupAddress: 'Av. Paulista, 1000 - São Paulo, SP',
    deliveryAddress: 'Rua Augusta, 500 - São Paulo, SP',
    vehicleType: 'moto'
  });
  
  // 5. Teste de Verificação de Assinatura
  console.log('\n5. 💳 Teste de Verificação de Assinatura');
  const subscriptionTest = await makeRequest('/subscription/check', 'POST', {
    email: userEmail
  });
  
  // 6. Teste de Conexão com Mercado Pago
  console.log('\n6. 🏪 Teste de Conexão Mercado Pago');
  const mpTest = await makeRequest('/subscription/test');
  
  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(50));
  
  const tests = [
    { name: 'Health Check', status: health.success },
    { name: 'Registro de Usuário', status: userRegister.success },
    { name: 'Cálculo de Frete', status: freightTest.success },
    { name: 'Verificação de Assinatura', status: subscriptionTest.success },
    { name: 'Conexão Mercado Pago', status: mpTest.success },
  ];
  
  tests.forEach(test => {
    const icon = test.status ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
  });
  
  const passedTests = tests.filter(t => t.status).length;
  const totalTests = tests.length;
  
  console.log(`\n📈 Resultado: ${passedTests}/${totalTests} testes passaram`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ A integração frontend-backend está funcionando!');
    console.log('\n🚀 Próximos passos:');
    console.log('1. Inicie o frontend com: npm run dev');
    console.log('2. Acesse http://localhost:5173');
    console.log('3. Teste o login e cadastro na interface');
  } else {
    console.log('\n⚠️ Alguns testes falharam.');
    console.log('Verifique os logs acima para mais detalhes.');
  }
}

// Executar os testes
if (typeof fetch === 'undefined') {
  // Node.js 18+ tem fetch nativo, mas pode precisar de polyfill em versões antigas
  import('node-fetch').then(fetch => {
    global.fetch = fetch.default;
    testIntegration().catch(console.error);
  }).catch(() => {
    console.error('Para executar este teste, instale node-fetch: npm install node-fetch');
  });
} else {
  testIntegration().catch(console.error);
}

