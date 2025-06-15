// Script de teste para verificar Mercado Pago
require('dotenv').config();
const axios = require('axios');

async function testMercadoPago() {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  const publicKey = process.env.MP_PUBLIC_KEY;
  
  console.log('🔧 Testando configuração do Mercado Pago...');
  console.log('Access Token:', accessToken ? 'Configurado' : 'Não configurado');
  console.log('Public Key:', publicKey ? 'Configurado' : 'Não configurado');
  
  if (!accessToken) {
    console.error('❌ Access Token não configurado!');
    return;
  }
  
  try {
    // Teste 1: Verificar usuário
    console.log('\n📋 Teste 1: Verificando usuário...');
    const userResponse = await axios.get('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Usuário autenticado:', userResponse.data.email);
    
    // Teste 2: Criar assinatura de teste
    console.log('\n🆕 Teste 2: Criando assinatura de teste...');
    const subscriptionData = {
      reason: 'Teste Monopoly Express - Plano Premium',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 19.90,
        currency_id: 'BRL'
      },
      payer_email: 'teste@monopolyexpress.com',
      back_url: 'http://localhost:5173/subscription/success',
      status: 'pending'
    };
    
    const subscriptionResponse = await axios.post(
      'https://api.mercadopago.com/preapproval',
      subscriptionData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Assinatura criada com sucesso!');
    console.log('📍 ID:', subscriptionResponse.data.id);
    console.log('🔗 Link de pagamento:', subscriptionResponse.data.init_point);
    console.log('📄 Status:', subscriptionResponse.data.status);
    
    // Salvar o link em um arquivo para fácil acesso
    const fs = require('fs');
    fs.writeFileSync('link-pagamento.txt', subscriptionResponse.data.init_point);
    console.log('💾 Link salvo em: link-pagamento.txt');
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testMercadoPago();

