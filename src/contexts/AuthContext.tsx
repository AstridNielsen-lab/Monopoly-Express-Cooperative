import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { authService, subscriptionService, handleApiError, User } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, userType: 'user' | 'motoboy' | 'admin') => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, phone: string, userType: 'user' | 'motoboy') => Promise<void>;
  registerMotoboy: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    cpf: string;
    cnh: string;
    vehicleType: string;
    vehiclePlate: string;
  }) => Promise<void>;
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

// Função para converter User para AuthUser
const convertToAuthUser = (user: User): AuthUser => {
  return {
    id: user.id,
    email: user.email,
    user_type: user.user_type,
    name: user.name,
    phone: user.phone,
    isPremium: user.is_premium,
    subscriptionStatus: user.subscription_status,
    subscriptionId: user.subscription_id,
    emailVerified: user.email_verified,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const storedUser = localStorage.getItem('monopoly_express_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Verificar status de assinatura ao inicializar
        checkSubscriptionStatus(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('monopoly_express_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: 'user' | 'motoboy' | 'admin') => {
    setIsLoading(true);
    try {
      console.log(`🔐 Fazendo login: ${email} como ${userType}`);
      const userData = await authService.login(email, password, userType);
      
      const authUser = convertToAuthUser(userData);
      setUser(authUser);
      localStorage.setItem('monopoly_express_user', JSON.stringify(authUser));
      
      // Verificar status de assinatura após login
      await checkSubscriptionStatus(authUser);
      
      toast.success(`Bem-vindo(a), ${userData.name}!`);
      console.log('✅ Login realizado com sucesso');
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro no login:', errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, phone: string, userType: 'user' | 'motoboy') => {
    setIsLoading(true);
    try {
      console.log(`📝 Registrando usuário: ${email} como ${userType}`);
      
      if (userType === 'user') {
        const userData = await authService.registerUser({ email, password, name, phone });
        
        const authUser = convertToAuthUser(userData);
        setUser(authUser);
        localStorage.setItem('monopoly_express_user', JSON.stringify(authUser));
        
        toast.success(`Conta criada com sucesso! Bem-vindo(a), ${name}!`);
        console.log('✅ Registro de usuário realizado com sucesso');
      } else {
        // Para motoboy, não faz login automático, apenas registra
        throw new Error('Use registerMotoboy para registrar motoboys');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro no registro:', errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const registerMotoboy = async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    cpf: string;
    cnh: string;
    vehicleType: string;
    vehiclePlate: string;
  }) => {
    setIsLoading(true);
    try {
      console.log(`🏍️ Registrando motoboy: ${data.email}`);
      
      await authService.registerMotoboy(data);
      
      toast.success(
        `Cadastro enviado com sucesso! ${data.name}, você receberá um email quando sua conta for aprovada.`,
        { duration: 5000 }
      );
      console.log('✅ Registro de motoboy realizado com sucesso');
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro no registro de motoboy:', errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout');
    setUser(null);
    localStorage.removeItem('monopoly_express_user');
    toast.success('Logout realizado com sucesso!');
  };

  const checkSubscriptionStatus = async (userToCheck: AuthUser) => {
    try {
      console.log(`🔍 Verificando status de assinatura para: ${userToCheck.email}`);
      const subscriptionData = await subscriptionService.checkSubscription(userToCheck.email);
      
      const updatedUser: AuthUser = {
        ...userToCheck,
        isPremium: subscriptionData.isActive || false,
        subscriptionId: subscriptionData.subscriptionId,
        subscriptionStatus: subscriptionData.status || 'inactive'
      };
      
      setUser(updatedUser);
      localStorage.setItem('monopoly_express_user', JSON.stringify(updatedUser));
      
      console.log(`✅ Status de assinatura atualizado: ${subscriptionData.isActive ? 'ATIVO' : 'INATIVO'}`);
    } catch (error) {
      console.error('❌ Erro ao verificar status de assinatura:', handleApiError(error));
    }
  };

  const checkSubscription = async () => {
    if (user) {
      await checkSubscriptionStatus(user);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      registerMotoboy,
      checkSubscription, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

