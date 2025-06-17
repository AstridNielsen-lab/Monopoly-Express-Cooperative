import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Verificar se as credenciais estão configuradas
    const mpConfig = {
      accessToken: process.env.MP_ACCESS_TOKEN ? 'Configurado' : 'Não configurado',
      publicKey: process.env.MP_PUBLIC_KEY ? 'Configurado' : 'Não configurado',
      clientId: process.env.MP_CLIENT_ID ? 'Configurado' : 'Não configurado',
      clientSecret: process.env.MP_CLIENT_SECRET ? 'Configurado' : 'Não configurado',
      subscriptionPlanId: process.env.MP_SUBSCRIPTION_PLAN_ID ? 'Configurado' : 'Não configurado'
    };

    const isFullyConfigured = Object.values(mpConfig).every(status => status === 'Configurado');

    res.status(200).json({
      message: 'Teste de conexão MercadoPago',
      status: isFullyConfigured ? 'Todas as credenciais configuradas' : 'Credenciais incompletas',
      mercadoPago: {
        ...mpConfig,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ error: 'Erro ao testar conexão' });
  }
}

