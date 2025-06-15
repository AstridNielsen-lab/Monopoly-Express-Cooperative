import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, userType: 'user' | 'motoboy' | 'admin') => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, phone: string, userType: 'user' | 'motoboy') => Promise<void>;
  checkSubscription: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const storedUser = localStorage.getItem('monopoly_express_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: 'user' | 'motoboy' | 'admin') => {
    setIsLoading(true);
    try {
      // Simulação de login - aqui você integraria com Supabase
      const mockUser: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        user_type: userType
      };
      
      setUser(mockUser);
      localStorage.setItem('monopoly_express_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Falha no login');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, phone: string, userType: 'user' | 'motoboy') => {
    setIsLoading(true);
    try {
      // Simulação de registro - aqui você integraria com Supabase
      const mockUser: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        user_type: userType
      };
      
      setUser(mockUser);
      localStorage.setItem('monopoly_express_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Falha no registro');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('monopoly_express_user');
  };

  const checkSubscriptionStatus = async (userToCheck: AuthUser) => {
    try {
      const response = await fetch('/api/subscription/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userToCheck.email })
      });

      if (response.ok) {
        const data = await response.json();
        const subscription = data.subscription;
        
        const updatedUser: AuthUser = {
          ...userToCheck,
          isPremium: subscription?.isActive || false,
          subscriptionId: subscription?.subscriptionId,
          subscriptionStatus: subscription?.status || 'inactive'
        };
        
        setUser(updatedUser);
        localStorage.setItem('monopoly_express_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Erro ao verificar status de assinatura:', error);
    }
  };

  const checkSubscription = async () => {
    if (user) {
      await checkSubscriptionStatus(user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, checkSubscription, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

