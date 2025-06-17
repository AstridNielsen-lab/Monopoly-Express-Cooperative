// Script para testar o registro de motoboy com bicicleta (CNH opcional)
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api';

async function testMotoboyRegistration() {
  console.log('🧪 Testando registro de motoboy com bicicleta...');
  
  try {
    // Teste 1: Motoboy com bicicleta (sem CNH e placa)
    console.log('\n1. Testando registro com bicicleta (sem CNH e placa)...');
    const response1 = await fetch(`${API_URL}/auth/register/motoboy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'ciclista@teste.com',
        password: '123456',
        name: 'João Ciclista',
        phone: '(11) 98765-4321',
        cpf: '123.456.789-00',
        vehicleType: 'bicicleta'
        // CNH e placa omitidos
      })
    });
    
    const result1 = await response1.json();
    console.log('✅ Resultado:', result1);
    
    // Teste 2: Motoboy com moto (CNH obrigatória)
    console.log('\n2. Testando registro com moto (CNH obrigatória)...');
    const response2 = await fetch(`${API_URL}/auth/register/motoboy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'motoqueiro@teste.com',
        password: '123456',
        name: 'Maria Motoqueira',
        phone: '(11) 91234-5678',
        cpf: '987.654.321-00',
        cnh: '12345678901',
        vehicleType: 'moto',
        vehiclePlate: 'ABC-1234'
      })
    });
    
    const result2 = await response2.json();
    console.log('✅ Resultado:', result2);
    
    // Teste 3: Teste de validação - moto sem CNH (deve falhar)
    console.log('\n3. Testando validação - moto sem CNH (deve falhar)...');
    const response3 = await fetch(`${API_URL}/auth/register/motoboy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'motosemcnh@teste.com',
        password: '123456',
        name: 'Pedro Moto',
        phone: '(11) 95555-5555',
        cpf: '111.222.333-44',
        vehicleType: 'moto'
        // CNH omitida - deve falhar
      })
    });
    
    const result3 = await response3.json();
    console.log('❌ Resultado (esperado erro):', result3);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

async function testDeliveryQueue() {
  console.log('\n🧪 Testando fila de entregas...');
  
  try {
    const response = await fetch(`${API_URL}/delivery/available`);
    const result = await response.json();
    
    console.log('✅ Entregas disponíveis na fila central:');
    console.log(result);
    
  } catch (error) {
    console.error('❌ Erro ao testar fila de entregas:', error.message);
  }
}

// Executar testes
testMotoboyRegistration()
  .then(() => testDeliveryQueue())
  .then(() => console.log('\n🎉 Todos os testes concluídos!'))
  .catch(console.error);

