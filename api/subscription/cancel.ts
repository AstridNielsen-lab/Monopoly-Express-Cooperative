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
    const { subscriptionId, userId } = req.body;

    if (!subscriptionId) {
      res.status(400).json({ error: 'ID da subscription é obrigatório' });
      return;
    }

    const db = getDatabase();

    // Cancelar subscription
    const updateStmt = db.prepare(`
      UPDATE users 
      SET is_premium = 0, 
          subscription_status = 'cancelled',
          updated_at = CURRENT_TIMESTAMP
      WHERE subscription_id = ?
    `);
    
    const result = updateStmt.run(subscriptionId);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Subscription não encontrada' });
      return;
    }

    res.status(200).json({
      message: 'Subscription cancelada com sucesso'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

