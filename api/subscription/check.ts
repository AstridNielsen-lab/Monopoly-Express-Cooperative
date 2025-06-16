import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../database';

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
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email é obrigatório' });
      return;
    }

    const db = getDatabase();
    
    // Buscar usuário
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as any;

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    // Verificar status da assinatura
    const subscriptionStatus = {
      isActive: user.is_premium || false,
      subscriptionId: user.subscription_id || null,
      status: user.subscription_status || 'inactive',
      payerEmail: user.email,
      nextBillingDate: user.subscription_end_date || null
    };

    res.status(200).json(subscriptionStatus);
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

