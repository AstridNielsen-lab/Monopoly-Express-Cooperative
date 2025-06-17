// Script para testar a API do Vercel
import fetch from 'node-fetch';

const API_URL = 'https://monopoly-express-logistica-a1wp7w5lj.vercel.app/api';

async function testAPI() {
  console.log('🧪 Testando API do Vercel...');
  
  try {
    // 1. Test Health Check
    console.log('\n1. Testando Health Check...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);
    
    // 2. Test Motoboy Registration
    console.log('\n2. Testando cadastro de motoboy...');
    const motoboyData = {
      email: 'teste@motoboy.com',
      password: '123456',
      name: 'João Motoboy',
      phone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      vehicleType: 'bicicleta'
    };
    
    const registerResponse = await fetch(`${API_URL}/auth/register/motoboy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(motoboyData)
    });
    
    const registerData = await registerResponse.json();
    console.log('📝 Cadastro motoboy:', registerData);
    
    // 3. Test Available Deliveries
    console.log('\n3. Testando entregas disponíveis...');
    const deliveriesResponse = await fetch(`${API_URL}/delivery/available`);
    const deliveriesData = await deliveriesResponse.json();
    console.log('🚚 Entregas:', deliveriesData);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    
    // Tentar testar endpoint específico
    try {
      console.log('\n🔍 Testando endpoint básico...');
      const response = await fetch('https://monopoly-express-logistica-a1wp7w5lj.vercel.app/', {
        timeout: 10000
      });
      
      if (response.ok) {
        console.log('✅ Frontend está funcionando');
      } else {
        console.log('⚠️ Status:', response.status, response.statusText);
      }
    } catch (frontendError) {
      console.error('❌ Erro no frontend:', frontendError.message);
    }
  }
}

// Executar teste
testAPI()
  .then(() => console.log('\n🎉 Teste concluído!'))
  .catch(console.error);

