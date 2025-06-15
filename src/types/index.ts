export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Motoboy {
  id: string;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  cnh: string;
  vehicle_type: 'moto' | 'carro' | 'bicicleta';
  vehicle_plate: string;
  is_active: boolean;
  rating: number;
  total_deliveries: number;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryRequest {
  id: string;
  user_id: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  description: string;
  price: number;
  distance: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  motoboy_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_type: 'user' | 'motoboy' | 'admin';
  name?: string;
  phone?: string;
  isPremium?: boolean;
  subscriptionId?: string;
  subscriptionStatus?: string;
  emailVerified?: boolean;
}

export interface DashboardStats {
  total_users: number;
  total_motoboys: number;
  total_deliveries: number;
  pending_deliveries: number;
  completed_deliveries: number;
  total_revenue: number;
  active_motoboys: number;
}

