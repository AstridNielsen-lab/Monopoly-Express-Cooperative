import { MercadoPagoConfig, Payment, PreApproval } from 'mercadopago';
import axios from 'axios';

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
});

const payment = new Payment(client);
const preApproval = new PreApproval(client);

export interface SubscriptionStatus {
  isActive: boolean;
  subscriptionId?: string;
  planId?: string;
  status?: string;
  nextBillingDate?: string;
  amount?: number;
  payerEmail?: string;
  error?: string;
}

export interface CreateSubscriptionData {
  payerEmail: string;
  cardToken?: string;
  backUrl?: string;
}

export class MercadoPagoService {
  private static instance: MercadoPagoService;
  private accessToken: string;
  private baseUrl = 'https://api.mercadopago.com';

  private constructor() {
    this.accessToken = process.env.MP_ACCESS_TOKEN || '';
    if (!this.accessToken) {
      console.warn('⚠️ Access Token do Mercado Pago não configurado');
    }
  }

  public static getInstance(): MercadoPagoService {
    if (!MercadoPagoService.instance) {
      MercadoPagoService.instance = new MercadoPagoService();
    }
    return MercadoPagoService.instance;
  }

  /**
   * Verificar se um usuário tem assinatura ativa
   */
  async checkUserSubscription(userEmail: string): Promise<SubscriptionStatus> {
    try {
      console.log(`🔍 Verificando assinatura para: ${userEmail}`);

      // Buscar assinaturas ativas do usuário
      const response = await axios.get(
        `${this.baseUrl}/preapproval/search`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          params: {
            payer_email: userEmail,
            status: 'authorized' // Apenas assinaturas ativas
          }
        }
      );

      const subscriptions = response.data.results || [];
      console.log(`📊 Encontradas ${subscriptions.length} assinaturas para ${userEmail}`);

      // Verificar se há alguma assinatura ativa do plano Monopoly Express
      for (const subscription of subscriptions) {
        if (this.isMonopolyExpressSubscription(subscription)) {
          console.log(`✅ Assinatura ativa encontrada: ${subscription.id}`);
          
          return {
            isActive: true,
            subscriptionId: subscription.id,
            planId: subscription.preapproval_plan_id,
            status: subscription.status,
            nextBillingDate: subscription.next_payment_date,
            amount: subscription.auto_recurring?.transaction_amount,
            payerEmail: subscription.payer_email
          };
        }
      }

      console.log(`❌ Nenhuma assinatura ativa encontrada para ${userEmail}`);
      return { isActive: false };

    } catch (error: any) {
      console.error('❌ Erro ao verificar assinatura:', error.response?.data || error.message);
      return { 
        isActive: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  /**
   * Criar nova assinatura para o usuário
   */
  async createSubscription(data: CreateSubscriptionData): Promise<any> {
    try {
      console.log(`🆕 Criando assinatura para: ${data.payerEmail}`);

      const subscriptionData = {
        reason: 'Assinatura Monopoly Express - Plano Premium',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 19.99,
          currency_id: 'BRL'
        },
        payer_email: data.payerEmail,
        back_url: data.backUrl || `${process.env.FRONTEND_URL}/subscription/success`,
        status: 'pending'
      };

      const response = await axios.post(
        `${this.baseUrl}/preapproval`,
        subscriptionData,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Assinatura criada: ${response.data.id}`);
      return response.data;

    } catch (error: any) {
      console.error('❌ Erro ao criar assinatura:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao criar assinatura');
    }
  }

  /**
   * Cancelar assinatura
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      console.log(`🚫 Cancelando assinatura: ${subscriptionId}`);

      await axios.put(
        `${this.baseUrl}/preapproval/${subscriptionId}`,
        { status: 'cancelled' },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Assinatura cancelada: ${subscriptionId}`);
      return true;

    } catch (error: any) {
      console.error('❌ Erro ao cancelar assinatura:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Buscar detalhes de uma assinatura específica
   */
  async getSubscriptionDetails(subscriptionId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/preapproval/${subscriptionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;

    } catch (error: any) {
      console.error('❌ Erro ao buscar detalhes da assinatura:', error.response?.data || error.message);
      throw new Error('Erro ao buscar detalhes da assinatura');
    }
  }

  /**
   * Verificar se a assinatura é do plano Monopoly Express
   */
  private isMonopolyExpressSubscription(subscription: any): boolean {
    // Verificar por valor (R$ 19,99)
    const amount = subscription.auto_recurring?.transaction_amount;
    if (amount === 19.99) {
      return true;
    }

    // Verificar por nome/descrição
    const reason = subscription.reason?.toLowerCase() || '';
    if (reason.includes('monopoly') || reason.includes('express')) {
      return true;
    }

    // Verificar por plan_id se configurado
    const planId = subscription.preapproval_plan_id;
    if (planId === process.env.MP_SUBSCRIPTION_PLAN_ID) {
      return true;
    }

    return false;
  }

  /**
   * Listar todas as assinaturas ativas (para admin)
   */
  async listActiveSubscriptions(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/preapproval/search`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          params: {
            status: 'authorized',
            limit: 100
          }
        }
      );

      const allSubscriptions = response.data.results || [];
      
      // Filtrar apenas assinaturas do Monopoly Express
      const monopolySubscriptions = allSubscriptions.filter(
        (sub: any) => this.isMonopolyExpressSubscription(sub)
      );

      console.log(`📊 Total de assinaturas Monopoly Express ativas: ${monopolySubscriptions.length}`);
      return monopolySubscriptions;

    } catch (error: any) {
      console.error('❌ Erro ao listar assinaturas:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Testar conectividade com a API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/users/me`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Conexão com Mercado Pago OK - Usuário: ${response.data.email}`);
      return true;

    } catch (error: any) {
      console.error('❌ Erro de conexão com Mercado Pago:', error.response?.data || error.message);
      return false;
    }
  }
}

export default MercadoPagoService;

