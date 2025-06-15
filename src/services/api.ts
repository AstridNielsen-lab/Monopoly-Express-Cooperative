// Serviço de API para conectar frontend com backend
import axios from 'axios';

// Configuração base da API
const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Interceptor para logs de requisições
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logs de respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Tipos de dados
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  user_type: 'user' | 'motoboy' | 'admin';
  email_verified?: boolean;
  is_premium?: boolean;
  subscription_status?: string;
  subscription_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Motoboy {
  id: string;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  cnh: string;
  vehicle_type: string;
  vehicle_plate: string;
  status: 'pending' | 'approved' | 'rejected';
  is_available?: boolean;
  created_at?: string;
}

export interface Delivery {
  id: string;
  user_id: string;
  motoboy_id?: string;
  pickup_address: string;
  delivery_address: string;
  recipient_name: string;
  recipient_phone: string;
  description: string;
  price: number;
  distance?: number;
  status: 'pending' | 'accepted' | 'in_transit' | 'completed' | 'cancelled';
  payment_method: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  subscriptionId?: string;
  status: string;
  amount?: number;
  nextBillingDate?: string;
  payerEmail: string;
}

// Serviços de Autenticação
export const authService = {
  // Login de usuário
  async login(email: string, password: string, userType: 'user' | 'motoboy' | 'admin'): Promise<User> {
    const response = await api.post('/auth/login', { email, password, userType });
    return response.data.user;
  },

  // Registro de usuário
  async registerUser(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }): Promise<User> {
    const response = await api.post('/auth/register/user', data);
    return response.data.user;
  },

  // Registro de motoboy
  async registerMotoboy(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    cpf: string;
    cnh: string;
    vehicleType: string;
    vehiclePlate: string;
  }): Promise<Motoboy> {
    const response = await api.post('/auth/register/motoboy', data);
    return response.data.motoboy;
  },

  // Verificar email
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Listar motoboys pendentes (admin)
  async getPendingMotoboys(): Promise<Motoboy[]> {
    const response = await api.get('/auth/pending/motoboys');
    return response.data.motoboys;
  },

  // Aprovar motoboy (admin)
  async approveMotoboy(motoboyId: string): Promise<{ message: string }> {
    const response = await api.post(`/auth/approve/motoboy/${motoboyId}`);
    return response.data;
  },

  // Rejeitar motoboy (admin)
  async rejectMotoboy(motoboyId: string): Promise<{ message: string }> {
    const response = await api.post(`/auth/reject/motoboy/${motoboyId}`);
    return response.data;
  },
};

// Serviços de Usuário
export const userService = {
  // Buscar dados do usuário
  async getUser(userId: string): Promise<User> {
    const response = await api.get(`/user/${userId}`);
    return response.data.user;
  },

  // Buscar estatísticas do usuário
  async getUserStats(userId: string): Promise<any> {
    const response = await api.get(`/user/${userId}/stats`);
    return response.data.stats;
  },

  // Atualizar dados do usuário
  async updateUser(userId: string, data: { name?: string; phone?: string }): Promise<User> {
    const response = await api.patch(`/user/${userId}`, data);
    return response.data.user;
  },
};

// Serviços de Motoboy
export const motoboyService = {
  // Buscar dados do motoboy
  async getMotoboy(motoboyId: string): Promise<Motoboy> {
    const response = await api.get(`/motoboy/${motoboyId}`);
    return response.data.motoboy;
  },

  // Atualizar disponibilidade
  async updateAvailability(motoboyId: string, isAvailable: boolean): Promise<{ message: string }> {
    const response = await api.patch(`/motoboy/${motoboyId}/availability`, { is_available: isAvailable });
    return response.data;
  },

  // Listar entregas do motoboy
  async getMotoboyDeliveries(motoboyId: string): Promise<Delivery[]> {
    const response = await api.get(`/motoboy/${motoboyId}/deliveries`);
    return response.data.deliveries;
  },

  // Buscar estatísticas do motoboy
  async getMotoboyStats(motoboyId: string): Promise<any> {
    const response = await api.get(`/motoboy/${motoboyId}/stats`);
    return response.data.stats;
  },

  // Atualizar localização
  async updateLocation(motoboyId: string, latitude: number, longitude: number): Promise<{ message: string }> {
    const response = await api.patch(`/motoboy/${motoboyId}/location`, { latitude, longitude });
    return response.data;
  },
};

// Serviços de Entrega
export const deliveryService = {
  // Calcular frete
  async calculateFreight(data: {
    pickupAddress: string;
    deliveryAddress: string;
    vehicleType: string;
  }): Promise<{ price: number; distance: number; estimatedTime: string }> {
    const response = await api.post('/delivery/calculate-freight', data);
    return response.data;
  },

  // Criar nova entrega
  async createDelivery(data: {
    userId: string;
    pickupAddress: string;
    deliveryAddress: string;
    recipientName: string;
    recipientPhone: string;
    description: string;
    paymentMethod: string;
  }): Promise<Delivery> {
    const response = await api.post('/delivery/create', data);
    return response.data.delivery;
  },

  // Listar entregas disponíveis (para motoboys)
  async getAvailableDeliveries(): Promise<Delivery[]> {
    const response = await api.get('/delivery/available');
    return response.data.deliveries;
  },

  // Aceitar entrega (motoboy)
  async acceptDelivery(deliveryId: string, motoboyId: string): Promise<{ message: string }> {
    const response = await api.post(`/delivery/${deliveryId}/accept`, { motoboy_id: motoboyId });
    return response.data;
  },

  // Atualizar status da entrega
  async updateDeliveryStatus(deliveryId: string, status: string): Promise<{ message: string }> {
    const response = await api.patch(`/delivery/${deliveryId}/status`, { status });
    return response.data;
  },

  // Buscar entrega por ID
  async getDelivery(deliveryId: string): Promise<Delivery> {
    const response = await api.get(`/delivery/${deliveryId}`);
    return response.data.delivery;
  },

  // Listar entregas do usuário
  async getUserDeliveries(userId: string): Promise<Delivery[]> {
    const response = await api.get(`/delivery/user/${userId}`);
    return response.data.deliveries;
  },
};

// Serviços de Assinatura
export const subscriptionService = {
  // Verificar status de assinatura
  async checkSubscription(email: string): Promise<SubscriptionStatus> {
    const response = await api.post('/subscription/check', { email });
    return response.data.subscription;
  },

  // Verificar status por ID do usuário
  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus & { userId: string; email: string; name: string }> {
    const response = await api.get(`/subscription/status/${userId}`);
    return response.data;
  },

  // Criar nova assinatura
  async createSubscription(data: {
    userId?: string;
    email: string;
    backUrl?: string;
  }): Promise<{ message: string; subscription: any }> {
    const response = await api.post('/subscription/create', data);
    return response.data;
  },

  // Cancelar assinatura
  async cancelSubscription(data: {
    userId?: string;
    subscriptionId: string;
  }): Promise<{ message: string }> {
    const response = await api.post('/subscription/cancel', data);
    return response.data;
  },

  // Listar assinaturas (admin)
  async listSubscriptions(): Promise<{ total: number; subscriptions: any[] }> {
    const response = await api.get('/subscription/list');
    return response.data;
  },

  // Testar conexão com Mercado Pago
  async testConnection(): Promise<{ mercadoPago: any }> {
    const response = await api.get('/subscription/test');
    return response.data;
  },
};

// Serviço de Health Check
export const healthService = {
  async check(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  },
};

// Função auxiliar para tratamento de erros
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'Erro desconhecido na API';
};

export default api;

