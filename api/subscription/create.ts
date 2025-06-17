import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../database';

// Simulação do serviço MercadoPago (você pode integrar com a SDK oficial)
class MercadoPagoService {
  private accessToken: string;
  
  constructor() {
    this.accessToken = process.env.MP_ACCESS_TOKEN || '';
  }

  async createSubscription(data: any) {
    // Simular criação de subscription
    // Em produção, use a SDK oficial do MercadoPago
    return {
      id: `subscription_${Date.now()}`,
      status: 'pending',
      payment_method_id: 'pix',
      payer: {
        email: data.email
      },
      amount: 29.90,
      currency: 'BRL',
      init_point: `https://www.mercadopago.com.br/subscriptions/checkout?subscription_id=subscription_${Date.now()}`,
      sandbox_init_point: `https://sandbox.mercadopago.com.br/subscriptions/checkout?subscription_id=subscription_${Date.now()}`
    };
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, userId, backUrl } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email é obrigatório' });
      return;
    }

    const db = getDatabase();
    const mpService = new MercadoPagoService();

    // Verificar se usuário existe
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as any;

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    // Verificar se já tem subscription ativa
    if (user.is_premium && user.subscription_status === 'active') {
      res.status(400).json({ error: 'Usuário já possui assinatura ativa' });
      return;
    }

    // Criar subscription no MercadoPago
    const subscription = await mpService.createSubscription({
      email,
      backUrl: backUrl || 'https://monopoly-express-logistica.vercel.app/dashboard'
    });

    // Atualizar usuário com dados da subscription
    const updateStmt = db.prepare(`
      UPDATE users 
      SET subscription_id = ?, subscription_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `);
    
    updateStmt.run(subscription.id, 'pending', email);

    res.status(200).json({
      message: 'Subscription criada com sucesso',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        amount: subscription.amount,
        currency: subscription.currency,
        init_point: subscription.init_point,
        sandbox_init_point: subscription.sandbox_init_point
      }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

