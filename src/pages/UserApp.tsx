import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { DeliveryRequest } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MapPin, Clock, Package, DollarSign, Navigation, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserApp: React.FC = () => {
  const { user, logout } = useAuth();
  const { location, error: locationError, requestLocation } = useGeolocation();
  const navigate = useNavigate();

  const [deliveryForm, setDeliveryForm] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    description: '',
    estimatedPrice: 0
  });

  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryRequest[]>([]);
  const [showNewDelivery, setShowNewDelivery] = useState(false);
  const [isCreatingDelivery, setIsCreatingDelivery] = useState(false);

  useEffect(() => {
    // Carregar entregas ativas do usuário
    loadActiveDeliveries();
  }, []);

  const loadActiveDeliveries = () => {
    // Simulação - aqui você faria a consulta real ao banco
    const mockDeliveries: DeliveryRequest[] = [
      {
        id: '1',
        user_id: user?.id || '',
        pickup_address: 'Rua das Flores, 123 - Centro',
        pickup_latitude: -23.550520,
        pickup_longitude: -46.633308,
        delivery_address: 'Av. Paulista, 1000 - Bela Vista',
        delivery_latitude: -23.561414,
        delivery_longitude: -46.656166,
        description: 'Documentos importantes',
        price: 15.00,
        distance: 5.2,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    setActiveDeliveries(mockDeliveries);
  };

  const calculateEstimatedPrice = (pickupAddr: string, deliveryAddr: string) => {
    // Cálculo simples baseado na distância estimada
    const basePrice = 8;
    const pricePerKm = 2;
    const estimatedDistance = Math.random() * 10 + 1; // Simulação
    return basePrice + (estimatedDistance * pricePerKm);
  };

  const handleAddressChange = (field: 'pickupAddress' | 'deliveryAddress', value: string) => {
    setDeliveryForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalcular preço se ambos os endereços estiverem preenchidos
      if (updated.pickupAddress && updated.deliveryAddress) {
        updated.estimatedPrice = calculateEstimatedPrice(updated.pickupAddress, updated.deliveryAddress);
      }
      
      return updated;
    });
  };

  const handleCreateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      toast.error('Localização necessária para criar entrega');
      return;
    }

    setIsCreatingDelivery(true);

    try {
      // Simulação da criação da entrega
      const newDelivery: DeliveryRequest = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: user?.id || '',
        pickup_address: deliveryForm.pickupAddress,
        pickup_latitude: location.latitude,
        pickup_longitude: location.longitude,
        delivery_address: deliveryForm.deliveryAddress,
        delivery_latitude: location.latitude + 0.01, // Simulação
        delivery_longitude: location.longitude + 0.01, // Simulação
        description: deliveryForm.description,
        price: deliveryForm.estimatedPrice,
        distance: 5.2,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setActiveDeliveries(prev => [newDelivery, ...prev]);
      
      // Resetar formulário
      setDeliveryForm({
        pickupAddress: '',
        deliveryAddress: '',
        description: '',
        estimatedPrice: 0
      });
      
      setShowNewDelivery(false);
      toast.success('Entrega criada com sucesso! Aguardando motoboy.');
    } catch (error) {
      toast.error('Erro ao criar entrega');
    } finally {
      setIsCreatingDelivery(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Aguardando';
      case 'accepted': return 'Aceita';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Olá!</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Localização */}
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Navigation className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Sua localização</h3>
                {location ? (
                  <p className="text-sm text-gray-500">
                    Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-sm text-red-500">Localização não detectada</p>
                )}
              </div>
            </div>
            {!location && (
              <Button onClick={requestLocation} size="sm">
                Ativar GPS
              </Button>
            )}
          </div>
          {locationError && (
            <p className="text-sm text-red-500 mt-2">{locationError}</p>
          )}
        </Card>

        {/* Botão Nova Entrega */}
        {!showNewDelivery && (
          <div className="mb-6">
            <Button
              onClick={() => setShowNewDelivery(true)}
              className="w-full h-14 text-lg"
            >
              <Package className="w-6 h-6 mr-2" />
              Nova Entrega
            </Button>
          </div>
        )}

        {/* Formulário Nova Entrega */}
        {showNewDelivery && (
          <Card className="mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Nova Entrega</h2>
              <button
                onClick={() => setShowNewDelivery(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateDelivery} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço de coleta
                </label>
                <input
                  type="text"
                  value={deliveryForm.pickupAddress}
                  onChange={(e) => handleAddressChange('pickupAddress', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Onde buscar?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço de entrega
                </label>
                <input
                  type="text"
                  value={deliveryForm.deliveryAddress}
                  onChange={(e) => handleAddressChange('deliveryAddress', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Onde entregar?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do item
                </label>
                <textarea
                  value={deliveryForm.description}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="O que será entregue?"
                  rows={3}
                />
              </div>

              {deliveryForm.estimatedPrice > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Preço estimado: R$ {deliveryForm.estimatedPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewDelivery(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingDelivery || !location}
                  className="flex-1"
                >
                  {isCreatingDelivery ? 'Criando...' : 'Solicitar Entrega'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Lista de Entregas */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Suas Entregas</h2>
          
          {activeDeliveries.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma entrega encontrada</p>
              <p className="text-sm text-gray-400 mt-1">Suas entregas aparecerão aqui</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeDeliveries.map((delivery) => (
                <Card key={delivery.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {getStatusText(delivery.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(delivery.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{delivery.pickup_address}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{delivery.delivery_address}</span>
                        </div>
                        {delivery.description && (
                          <div className="flex items-start space-x-2">
                            <Package className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{delivery.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        R$ {delivery.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {delivery.distance.toFixed(1)} km
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserApp;

