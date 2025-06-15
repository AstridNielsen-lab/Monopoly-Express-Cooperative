import express from 'express';
import { db } from '../database/setup.js';
import MercadoPagoService, { SubscriptionStatus } from '../services/mercadoPagoService.js';

// Interface já importada do serviço

// Mock do serviço para teste inicial
class MockMercadoPagoService {
  static getInstance() {
    return new MockMercadoPagoService();
  }
  
  async checkUserSubscription(email: string): Promise<SubscriptionStatus> {
    console.log(`🔍 [MOCK] Verificando assinatura para: ${email}`);
    
    // Simular alguns usuários com assinatura ativa para teste
    const activeUsers = [
      'admin@monopolyexpress.com',
      'teste@exemplo.com',
      'usuario@monopoly.com'
    ];
    
    return {
      isActive: activeUsers.includes(email),
      subscriptionId: activeUsers.includes(email) ? 'mock_subscription_123' : undefined,
      status: activeUsers.includes(email) ? 'authorized' : 'inactive',
      amount: activeUsers.includes(email) ? 19.90 : undefined,
      payerEmail: email
    };
  }
  
  async testConnection(): Promise<boolean> {
    console.log('🔧 [MOCK] Testando conexão (modo simulado)');
    return true;
  }
  
  async listActiveSubscriptions(): Promise<any[]> {
    console.log('📊 [MOCK] Listando assinaturas (modo simulado)');
    return [
      {
        id: 'mock_sub_1',
        payer_email: 'admin@monopolyexpress.com',
        status: 'authorized',
        auto_recurring: { transaction_amount: 19.90 },
        next_payment_date: '2025-07-15'
      }
    ];
  }
  
  async createSubscription(data: any): Promise<any> {
    console.log('🆕 [MOCK] Criando assinatura (modo simulado)');
    return {
      id: 'mock_new_sub_' + Date.now(),
      init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mock',
      status: 'pending'
    };
  }
  
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`🚫 [MOCK] Cancelando assinatura: ${subscriptionId}`);
    return true;
  }
  
  async getSubscriptionDetails(subscriptionId: string): Promise<any> {
    console.log(`📋 [MOCK] Buscando detalhes da assinatura: ${subscriptionId}`);
    return {
      id: subscriptionId,
      status: 'authorized',
      next_payment_date: '2025-07-15',
      auto_recurring: { transaction_amount: 19.90 }
    };
  }
}

const router = express.Router();
// Usar serviço real em desenvolvimento/produção
const mpService = MercadoPagoService.getInstance();
// Para teste local, descomente a linha abaixo:
// const mpService = MockMercadoPagoService.getInstance();

/**
 * Verificar status de assinatura de um usuário
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Buscar usuário no banco local
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar assinatura no Mercado Pago
    const subscriptionStatus = await mpService.checkUserSubscription(user.email);
    
    // Atualizar status no banco local
    await updateUserSubscriptionStatus(userId, subscriptionStatus);
    
    res.json({
      userId,
      email: user.email,
      name: user.name,
      subscription: subscriptionStatus
    });
    
  } catch (error) {
    console.error('Erro ao verificar status de assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Verificar assinatura por email
 */
router.post('/check', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }
    
    // Verificar no Mercado Pago
    const subscriptionStatus = await mpService.checkUserSubscription(email);
    
    // Buscar usuário no banco local
    const user = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get(email);
    
    if (user) {
      // Atualizar status no banco local
      await updateUserSubscriptionStatus(user.id, subscriptionStatus);
    }
    
    res.json({
      email,
      subscription: subscriptionStatus,
      userExists: !!user
    });
    
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Criar nova assinatura
 */
router.post('/create', async (req, res) => {
  try {
    const { userId, email, backUrl } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }
    
    // Verificar se já tem assinatura ativa
    const existingSubscription = await mpService.checkUserSubscription(email);
    
    if (existingSubscription.isActive) {
      return res.status(400).json({ 
        error: 'Usuário já possui assinatura ativa',
        subscription: existingSubscription
      });
    }
    
    // Criar nova assinatura
    const subscription = await mpService.createSubscription({
      payerEmail: email,
      backUrl
    });
    
    // Atualizar banco local se o usuário existir
    if (userId) {
      const stmt = db.prepare(`
        UPDATE users 
        SET subscription_id = ?, subscription_status = 'pending', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(subscription.id, userId);
    }
    
    res.json({
      message: 'Assinatura criada com sucesso',
      subscription
    });
    
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    });
  }
});

/**
 * Cancelar assinatura
 */
router.post('/cancel', async (req, res) => {
  try {
    const { userId, subscriptionId } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({ error: 'ID da assinatura é obrigatório' });
    }
    
    // Cancelar no Mercado Pago
    const cancelled = await mpService.cancelSubscription(subscriptionId);
    
    if (!cancelled) {
      return res.status(400).json({ error: 'Não foi possível cancelar a assinatura' });
    }
    
    // Atualizar banco local
    if (userId) {
      const stmt = db.prepare(`
        UPDATE users 
        SET is_premium = FALSE, subscription_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(userId);
    }
    
    res.json({ message: 'Assinatura cancelada com sucesso' });
    
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Listar todas as assinaturas ativas (somente admin)
 */
router.get('/list', async (req, res) => {
  try {
    // Verificar se o usuário é admin (implementar autenticação depois)
    
    const subscriptions = await mpService.listActiveSubscriptions();
    
    res.json({
      total: subscriptions.length,
      subscriptions
    });
    
  } catch (error) {
    console.error('Erro ao listar assinaturas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Webhook do Mercado Pago para notificações
 */
router.post('/webhook', async (req, res) => {
  try {
    const { action, data, type } = req.body;
    
    console.log('Webhook recebido do Mercado Pago:', { action, type, data });
    
    // Processar notificações de assinatura
    if (type === 'preapproval') {
      const subscriptionId = data.id;
      
      // Buscar detalhes da assinatura
      const subscriptionDetails = await mpService.getSubscriptionDetails(subscriptionId);
      
      // Atualizar status do usuário no banco local
      const user = db.prepare('SELECT id FROM users WHERE subscription_id = ?').get(subscriptionId);
      
      if (user) {
        const stmt = db.prepare(`
          UPDATE users 
          SET 
            subscription_status = ?,
            is_premium = ?,
            subscription_end_date = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        const isPremium = subscriptionDetails.status === 'authorized';
        const endDate = subscriptionDetails.next_payment_date;
        
        stmt.run(subscriptionDetails.status, isPremium, endDate, user.id);
        
        console.log(`Status de assinatura atualizado para usuário ${user.id}: ${subscriptionDetails.status}`);
      }
    }
    
    res.status(200).json({ message: 'Webhook processado com sucesso' });
    
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Testar conexão com Mercado Pago
 */
router.get('/test', async (req, res) => {
  try {
    const isConnected = await mpService.testConnection();
    
    res.json({
      mercadoPago: {
        connected: isConnected,
        accessToken: process.env.MP_ACCESS_TOKEN ? 'Configurado' : 'Não configurado',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Função auxiliar para atualizar status de assinatura
 */
async function updateUserSubscriptionStatus(userId: string, subscriptionStatus: SubscriptionStatus) {
  try {
    const stmt = db.prepare(`
      UPDATE users 
      SET 
        is_premium = ?,
        subscription_id = ?,
        subscription_status = ?,
        subscription_end_date = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      subscriptionStatus.isActive,
      subscriptionStatus.subscriptionId || null,
      subscriptionStatus.status || 'inactive',
      subscriptionStatus.nextBillingDate || null,
      userId
    );
    
    console.log(`Status de assinatura atualizado para usuário ${userId}:`, subscriptionStatus.isActive ? 'ATIVO' : 'INATIVO');
    
  } catch (error) {
    console.error('Erro ao atualizar status de assinatura no banco:', error);
  }
}

export { router as subscriptionRoutes };

