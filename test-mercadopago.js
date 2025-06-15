import 'dotenv/config';
import MercadoPagoService from './backend/services/mercadoPagoService.js';

async function testMercadoPago() {
  console.log('🗺️ TESTE DE INTEGRAÇÃO MERCADO PAGO');
  console.log('==========================================');
  console.log('');
  
  const mpService = MercadoPagoService.getInstance();
  
  // Testar configurações
  console.log('🔧 Configurações:');
  console.log('   Public Key:', process.env.MP_PUBLIC_KEY ? '✅ Configurado' : '❌ Não configurado');
  console.log('   Access Token:', process.env.MP_ACCESS_TOKEN ? '✅ Configurado' : '❌ Não configurado');
  console.log('   Client ID:', process.env.MP_CLIENT_ID ? '✅ Configurado' : '❌ Não configurado');
  console.log('   Client Secret:', process.env.MP_CLIENT_SECRET ? '✅ Configurado' : '❌ Não configurado');
  console.log('');
  
  // Testar conexão
  console.log('🔌 Testando conexão com Mercado Pago...');
  const isConnected = await mpService.testConnection();
  
  if (!isConnected) {
    console.log('❌ Falha na conexão com Mercado Pago');
    console.log('📝 Verifique suas credenciais no arquivo .env');
    return;
  }
  
  console.log('');
  
  // Listar assinaturas ativas
  console.log('📊 Listando assinaturas ativas...');
  const activeSubscriptions = await mpService.listActiveSubscriptions();
  
  console.log(`   Total de assinaturas encontradas: ${activeSubscriptions.length}`);
  
  if (activeSubscriptions.length > 0) {
    console.log('   Assinaturas ativas:');
    activeSubscriptions.forEach((sub, index) => {
      console.log(`   ${index + 1}. ID: ${sub.id}`);
      console.log(`      Email: ${sub.payer_email}`);
      console.log(`      Status: ${sub.status}`);
      console.log(`      Valor: R$ ${sub.auto_recurring?.transaction_amount || 'N/A'}`);
      console.log(`      Próximo pagamento: ${sub.next_payment_date || 'N/A'}`);
      console.log('');
    });
  } else {
    console.log('   📄 Nenhuma assinatura ativa encontrada');
  }
  
  console.log('');
  
  // Testar verificação de email específico
  const testEmail = 'admin@monopolyexpress.com';
  console.log(`🔍 Testando verificação para email: ${testEmail}`);
  
  const subscriptionStatus = await mpService.checkUserSubscription(testEmail);
  
  console.log('   Resultado:');
  console.log('   - Assinatura ativa:', subscriptionStatus.isActive ? '✅ Sim' : '❌ Não');
  if (subscriptionStatus.subscriptionId) {
    console.log('   - ID da assinatura:', subscriptionStatus.subscriptionId);
    console.log('   - Status:', subscriptionStatus.status);
    console.log('   - Valor:', subscriptionStatus.amount ? `R$ ${subscriptionStatus.amount}` : 'N/A');
    console.log('   - Próximo pagamento:', subscriptionStatus.nextBillingDate || 'N/A');
  }
  if (subscriptionStatus.error) {
    console.log('   - Erro:', subscriptionStatus.error);
  }
  
  console.log('');
  console.log('✅ Teste concluído!');
  console.log('');
  console.log('📝 Próximos passos:');
  console.log('   1. Configurar webhook no Mercado Pago (opcional)');
  console.log('   2. Testar criacao de assinaturas via API');
  console.log('   3. Integrar verificação de assinatura no login');
}

// Executar teste
testMercadoPago().catch(error => {
  console.error('❌ Erro durante o teste:', error);
  process.exit(1);
});

