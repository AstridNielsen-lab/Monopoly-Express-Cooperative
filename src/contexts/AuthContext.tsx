import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, userType: 'user' | 'motoboy' | 'admin') => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, phone: string, userType: 'user' | 'motoboy') => Promise<void>;
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

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

