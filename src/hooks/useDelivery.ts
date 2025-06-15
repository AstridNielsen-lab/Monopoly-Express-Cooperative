import { useState, useCallback } from 'react';
import { deliveryService, Delivery, handleApiError } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export const useDelivery = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [freightCalculation, setFreightCalculation] = useState<{
    price: number;
    distance: number;
    estimatedTime: string;
  } | null>(null);
  const { user } = useAuth();

  // Calcular frete
  const calculateFreight = useCallback(async (data: {
    pickupAddress: string;
    deliveryAddress: string;
    vehicleType: string;
  }) => {
    setIsLoading(true);
    try {
      console.log('💰 Calculando frete:', data);
      const result = await deliveryService.calculateFreight(data);
      setFreightCalculation(result);
      console.log('✅ Frete calculado:', result);
      return result;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro ao calcular frete:', errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar nova entrega
  const createDelivery = useCallback(async (data: {
    pickupAddress: string;
    deliveryAddress: string;
    recipientName: string;
    recipientPhone: string;
    description: string;
    paymentMethod: string;
  }) => {
    if (!user) {
      toast.error('Você precisa estar logado para criar uma entrega');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📦 Criando entrega:', data);
      const delivery = await deliveryService.createDelivery({
        ...data,
        userId: user.id,
      });
      
      // Atualizar lista de entregas
      setDeliveries(prev => [delivery, ...prev]);
      
      toast.success('Entrega criada com sucesso!');
      console.log('✅ Entrega criada:', delivery);
      return delivery;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro ao criar entrega:', errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Listar entregas do usuário
  const getUserDeliveries = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log(`📋 Carregando entregas do usuário: ${user.id}`);
      const userDeliveries = await deliveryService.getUserDeliveries(user.id);
      setDeliveries(userDeliveries);
      console.log(`✅ ${userDeliveries.length} entregas carregadas`);
      return userDeliveries;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro ao carregar entregas:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Listar entregas disponíveis (para motoboys)
  const getAvailableDeliveries = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('📋 Carregando entregas disponíveis');
      const availableDeliveries = await deliveryService.getAvailableDeliveries();
      setDeliveries(availableDeliveries);
      console.log(`✅ ${availableDeliveries.length} entregas disponíveis carregadas`);
      return availableDeliveries;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro ao carregar entregas disponíveis:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aceitar entrega (motoboy)
  const acceptDelivery = useCallback(async (deliveryId: string) => {
    if (!user || user.user_type !== 'motoboy') {
      toast.error('Apenas motoboys podem aceitar entregas');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`👍 Aceitando entrega: ${deliveryId}`);
      await deliveryService.acceptDelivery(deliveryId, user.id);
      
      // Atualizar lista removendo a entrega aceita
      setDeliveries(prev => prev.filter(d => d.id !== deliveryId));
      
      toast.success('Entrega aceita com sucesso!');
      console.log('✅ Entrega aceita');
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro ao aceitar entrega:', errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Atualizar status da entrega
  const updateDeliveryStatus = useCallback(async (deliveryId: string, status: string) => {
    setIsLoading(true);
    try {
      console.log(`🔄 Atualizando status da entrega ${deliveryId} para: ${status}`);
      await deliveryService.updateDeliveryStatus(deliveryId, status);
      
      // Atualizar na lista local
      setDeliveries(prev => prev.map(d => 
        d.id === deliveryId ? { ...d, status: status as any } : d
      ));
      
      toast.success('Status atualizado com sucesso!');
      console.log('✅ Status atualizado');
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro ao atualizar status:', errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar entrega por ID
  const getDelivery = useCallback(async (deliveryId: string) => {
    setIsLoading(true);
    try {
      console.log(`🔍 Buscando entrega: ${deliveryId}`);
      const delivery = await deliveryService.getDelivery(deliveryId);
      console.log('✅ Entrega encontrada:', delivery);
      return delivery;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('❌ Erro ao buscar entrega:', errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deliveries,
    isLoading,
    freightCalculation,
    calculateFreight,
    createDelivery,
    getUserDeliveries,
    getAvailableDeliveries,
    acceptDelivery,
    updateDeliveryStatus,
    getDelivery,
    // Função para limpar cache
    clearDeliveries: () => setDeliveries([]),
    clearFreightCalculation: () => setFreightCalculation(null),
  };
};

export default useDelivery;

