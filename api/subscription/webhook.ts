import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from '../database';
import crypto from 'crypto';

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
    const { type, data, action } = req.body;

    console.log('Webhook MercadoPago recebido:', { type, data, action });

    // Verificar se é uma notificação de pagamento
    if (type === 'payment' && data?.id) {
      const db = getDatabase();
      
      // Processar pagamento
      // Em um cenário real, você faria uma consulta à API do MercadoPago
      // para verificar o status real do pagamento
      
      if (action === 'payment.created' || action === 'payment.updated') {
        // Simular aprovação do pagamento
        // Em produção, consulte a API do MP para obter o status real
        const paymentStatus = 'approved'; // Simulação
        
        if (paymentStatus === 'approved') {
          // Ativar subscription do usuário
          const subscriptionId = `subscription_${data.id}`;
          
          const updateStmt = db.prepare(`
            UPDATE users 
            SET is_premium = 1, 
                subscription_status = 'active',
                subscription_end_date = datetime('now', '+1 month'),
                updated_at = CURRENT_TIMESTAMP
            WHERE subscription_id = ?
          `);
          
          const result = updateStmt.run(subscriptionId);
          
          if (result.changes > 0) {
            console.log(`Subscription ativada para: ${subscriptionId}`);
          }
        }
      }
    }

    // Responder com 200 para confirmar recebimento
    res.status(200).json({ message: 'Webhook processado com sucesso' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
}

